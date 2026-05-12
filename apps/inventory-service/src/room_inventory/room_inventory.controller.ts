import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { RoomInventoryService } from './room_inventory.service';

@Controller('inventories')
export class RoomInventoryController {
  constructor(private readonly inventoryService: RoomInventoryService) {}

  @Get()
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Post('generate')
  async generateInventory(
    @Body()
    body: {
      roomId: string;
      startDate: Date;
      endDate: Date;
      totalStock: number;
    },
  ) {
    return this.inventoryService.generateInventory(
      body.roomId,
      new Date(body.startDate),
      new Date(body.endDate),
      body.totalStock,
    );
  }

  @Get('availability/check')
  async checkAvailability(
    @Query('roomId') roomId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.inventoryService.checkAvailability(
      roomId,
      new Date(checkIn),
      new Date(checkOut),
    );
  }

  @Get('range/search')
  async getInventoryRange(
    @Query('roomId') roomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.inventoryService.getInventoryRange(
      roomId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('lock')
  async lockInventory(
    @Body()
    body: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    },
  ) {
    return this.inventoryService.lockInventory(
      body.roomId,
      new Date(body.checkIn),
      new Date(body.checkOut),
    );
  }

  @Post('confirm')
  async confirmBooking(
    @Body()
    body: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    },
  ) {
    return this.inventoryService.confirmBooking(
      body.roomId,
      new Date(body.checkIn),
      new Date(body.checkOut),
    );
  }

  @Post('release')
  async releaseInventory(
    @Body()
    body: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    },
  ) {
    return this.inventoryService.releaseInventory(
      body.roomId,
      new Date(body.checkIn),
      new Date(body.checkOut),
    );
  }

  @Patch('stop-sell')
  async stopSell(
    @Body()
    body: {
      roomId: string;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.inventoryService.stopSell(
      body.roomId,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }

  @Patch('resume-sell')
  async resumeSell(
    @Body()
    body: {
      roomId: string;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.inventoryService.resumeSell(
      body.roomId,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }

  @Patch('stock')
  async updateStock(
    @Body()
    body: {
      roomId: string;
      date: Date;
      totalStock: number;
    },
  ) {
    return this.inventoryService.updateStock(
      body.roomId,
      new Date(body.date),
      body.totalStock,
    );
  }
}