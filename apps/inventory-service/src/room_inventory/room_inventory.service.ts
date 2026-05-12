import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';

import { RoomInventory } from './entities/room_inventory.entity';

@Injectable()
export class RoomInventoryService {
  constructor(
    @InjectRepository(RoomInventory)
    private readonly inventoryRepository: Repository<RoomInventory>,

    private readonly dataSource: DataSource,
  ) {}

  async generateInventory(
    roomId: string,
    startDate: Date,
    endDate: Date,
    totalStock: number,
  ): Promise<void> {
    if (startDate >= endDate) {
      throw new BadRequestException('startDate must be before endDate');
    }

    const inventories: RoomInventory[] = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const inventory = this.inventoryRepository.create({
        roomId,
        date: new Date(currentDate),
        totalStock,
        availableStock: totalStock,
        reservedStock: 0,
        soldStock: 0,
        stopSell: false,
      });

      inventories.push(inventory);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    await this.inventoryRepository.save(inventories);
  }

  async getInventoryRange(
    roomId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<RoomInventory[]> {
    return this.inventoryRepository.find({
      where: { roomId, date: Between(startDate, endDate) },
      order: { date: 'ASC' },
    });
  }

  async checkAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const inventories = await this.inventoryRepository.find({
      where: { roomId, date: Between(checkIn, checkOut) },
    });

    if (!inventories.length) {
      return false;
    }

    return inventories.every(
      (inventory) => inventory.availableStock > 0 && !inventory.stopSell,
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
        .andWhere('inventory.date BETWEEN :checkIn AND :checkOut', {
          checkIn,
          checkOut,
        })
        .getMany();

      if (!inventories.length) {
        throw new NotFoundException('Inventory not found');
      }

      for (const inventory of inventories) {
        if (inventory.availableStock <= 0 || inventory.stopSell) {
          throw new BadRequestException(
            `Room unavailable on ${inventory.date.toISOString().split('T')[0]}`,
          );
        }

        inventory.availableStock -= 1;
        inventory.reservedStock += 1;
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
        .andWhere('inventory.date BETWEEN :checkIn AND :checkOut', {
          checkIn,
          checkOut,
        })
        .getMany();

      for (const inventory of inventories) {
        if (inventory.reservedStock <= 0) {
          throw new BadRequestException('No reserved inventory found');
        }

        inventory.reservedStock -= 1;
        inventory.soldStock += 1;
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
        .andWhere('inventory.date BETWEEN :checkIn AND :checkOut', {
          checkIn,
          checkOut,
        })
        .getMany();

      for (const inventory of inventories) {
        if (inventory.reservedStock <= 0) {
          continue;
        }

        inventory.reservedStock -= 1;
        inventory.availableStock += 1;
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
      { roomId, date: Between(startDate, endDate) },
      { stopSell: true },
    );
  }

  async resumeSell(
    roomId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    await this.inventoryRepository.update(
      { roomId, date: Between(startDate, endDate) },
      { stopSell: false },
    );
  }

  async updateStock(
    roomId: string,
    date: Date,
    totalStock: number,
  ): Promise<RoomInventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { roomId, date },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const usedStock = inventory.reservedStock + inventory.soldStock;

    if (totalStock < usedStock) {
      throw new BadRequestException(
        'Total stock cannot be smaller than used stock',
      );
    }

    inventory.totalStock = totalStock;
    inventory.availableStock = totalStock - usedStock;

    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<RoomInventory[]> {
    return this.inventoryRepository.find({
      order: { date: 'ASC' },
    });
  }

  async findById(id: string): Promise<RoomInventory> {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }
}