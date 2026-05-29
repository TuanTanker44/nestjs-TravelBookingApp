import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';

import { RoomInventory } from './entities/room_inventory.entity';

@Injectable()
export class RoomInventoryService {
  constructor(
    @InjectRepository(RoomInventory)
    private readonly inventoryRepository: Repository<RoomInventory>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async generateInventory(
    roomId: string,
    startDate: Date,
    endDate: Date,
    totalRooms: number,
    price: number,
  ): Promise<RoomInventory[]> {
    if (startDate >= endDate) {
      throw new BadRequestException('startDate must be before endDate');
    }

    const inventories: RoomInventory[] = [];

    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const inventory = this.inventoryRepository.create({
        roomId,

        inventoryDate: new Date(currentDate).toISOString().split('T')[0],

        totalRooms,

        reservedRooms: 0,

        availableRooms: totalRooms,

        price,

        isClosed: false,
      });

      inventories.push(inventory);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return await this.inventoryRepository.save(inventories);
  }

  async checkAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const inventories = await this.inventoryRepository.find({
      where: {
        roomId,
        inventoryDate: Between(
          checkIn.toISOString().split('T')[0],
          checkOut.toISOString().split('T')[0],
        ),
      },
    });

    if (!inventories.length) {
      return false;
    }

    return inventories.every(
      (inventory) => inventory.availableRooms > 0 && !inventory.isClosed,
    );
  }

  async lockInventory(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const inventories = await queryRunner.manager
        .createQueryBuilder(RoomInventory, 'inventory')
        .setLock('pessimistic_write')
        .where('inventory.roomId = :roomId', { roomId })
        .andWhere(
          `
        inventory.inventoryDate
        BETWEEN :checkIn AND :checkOut
        `,
          {
            checkIn: checkIn.toISOString().split('T')[0],

            checkOut: checkOut.toISOString().split('T')[0],
          },
        )
        .getMany();

      if (!inventories.length) {
        throw new NotFoundException('Inventory not found');
      }

      for (const inventory of inventories) {
        if (inventory.availableRooms <= 0 || inventory.isClosed) {
          throw new BadRequestException(
            `Room unavailable on ${inventory.inventoryDate}`,
          );
        }

        inventory.availableRooms -= 1;

        inventory.reservedRooms += 1;
      }

      await queryRunner.manager.save(inventories);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirmBooking(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const inventories = await queryRunner.manager
        .createQueryBuilder(RoomInventory, 'inventory')
        .setLock('pessimistic_write')
        .where('inventory.roomId = :roomId', { roomId })
        .andWhere(
          `
        inventory.inventoryDate
        BETWEEN :checkIn AND :checkOut
        `,
          {
            checkIn: checkIn.toISOString().split('T')[0],

            checkOut: checkOut.toISOString().split('T')[0],
          },
        )
        .getMany();

      if (!inventories.length) {
        throw new NotFoundException('Inventory not found');
      }

      for (const inventory of inventories) {
        if (inventory.reservedRooms <= 0) {
          throw new BadRequestException(
            `No reserved inventory found on ${inventory.inventoryDate}`,
          );
        }

        inventory.reservedRooms -= 1;
      }

      await queryRunner.manager.save(inventories);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async releaseInventory(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const inventories = await queryRunner.manager
        .createQueryBuilder(RoomInventory, 'inventory')
        .setLock('pessimistic_write')
        .where('inventory.roomId = :roomId', { roomId })
        .andWhere(
          `
        inventory.inventoryDate
        BETWEEN :checkIn AND :checkOut
        `,
          {
            checkIn: checkIn.toISOString().split('T')[0],

            checkOut: checkOut.toISOString().split('T')[0],
          },
        )
        .getMany();

      if (!inventories.length) {
        throw new NotFoundException('Inventory not found');
      }

      for (const inventory of inventories) {
        if (inventory.reservedRooms <= 0) {
          continue;
        }

        inventory.reservedRooms -= 1;

        inventory.availableRooms += 1;
      }

      await queryRunner.manager.save(inventories);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async stopSell(
    roomId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    await this.inventoryRepository.update(
      {
        roomId,

        inventoryDate: Between(
          startDate.toISOString().split('T')[0],

          endDate.toISOString().split('T')[0],
        ),
      },
      {
        isClosed: true,
      },
    );
  }

  async resumeSell(
    roomId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    await this.inventoryRepository.update(
      {
        roomId,
        inventoryDate: Between(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
        ),
      },
      { isClosed: false },
    );
  }

  async updateStock(
    roomId: string,
    date: Date,
    totalRooms: number,
  ): Promise<RoomInventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        roomId,

        inventoryDate: date.toISOString().split('T')[0],
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const usedRooms = inventory.reservedRooms;

    if (totalRooms < usedRooms) {
      throw new BadRequestException(
        `
      Total rooms cannot be smaller
      than reserved rooms
      `,
      );
    }

    inventory.totalRooms = totalRooms;

    inventory.availableRooms = totalRooms - usedRooms;

    return await this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<RoomInventory[]> {
    return await this.inventoryRepository.find({
      order: {
        inventoryDate: 'ASC',
      },
    });
  }

  async findById(id: string): Promise<RoomInventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }
}
