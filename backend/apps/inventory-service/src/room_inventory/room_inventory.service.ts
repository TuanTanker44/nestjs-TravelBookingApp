import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';

import { RoomInventory } from './entities/room_inventory.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoomInventoryService {
  constructor(
    @InjectRepository(RoomInventory)
    private readonly inventoryRepository: Repository<RoomInventory>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly redis: RedisService,
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

    const createdInventories = await this.inventoryRepository.save(inventories);

    await this.invalidateInventoryCache();

    return createdInventories;
  }

  async checkAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const key = `inventory:availability:${roomId}:${this.normalizeDate(checkIn)}:${this.normalizeDate(checkOut)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as boolean;
    }

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
      await this.redis.set(key, JSON.stringify(false), 3600);

      return false;
    }

    const available = inventories.every(
      (inventory) => inventory.availableRooms > 0 && !inventory.isClosed,
    );

    await this.redis.set(key, JSON.stringify(available), 3600);

    return available;
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

      await this.invalidateInventoryCache();
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

      await this.invalidateInventoryCache();
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

      await this.invalidateInventoryCache();
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

    await this.invalidateInventoryCache();
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

    await this.invalidateInventoryCache();
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

    const updatedInventory = await this.inventoryRepository.save(inventory);

    await this.invalidateInventoryCache();

    return updatedInventory;
  }

  async findAll(): Promise<RoomInventory[]> {
    const key = 'inventory:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomInventory[];
    }

    const inventories = await this.inventoryRepository.find({
      order: {
        inventoryDate: 'ASC',
      },
    });

    await this.redis.set(key, JSON.stringify(inventories), 3600);

    return inventories;
  }

  async findById(id: string): Promise<RoomInventory> {
    const key = `inventory:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomInventory;
    }

    const inventory = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    await this.redis.set(key, JSON.stringify(inventory), 3600);

    return inventory;
  }

  private normalizeDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private async invalidateInventoryCache() {
    await this.redis.delPattern('inventory:*');
  }
}
