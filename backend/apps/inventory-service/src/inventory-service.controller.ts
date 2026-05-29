import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InventoryServiceService } from './inventory-service.service';

@Controller('inventory')
export class InventoryServiceController {
  constructor(
    private readonly inventoryServiceService: InventoryServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.inventoryServiceService.getHello();
  }

  @Get('items')
  findAll() {
    return this.inventoryServiceService.findAll();
  }

  @Get('items/:id')
  findById(@Param('id') id: string) {
    return this.inventoryServiceService.findById(id);
  }

  @Post('generate')
  generateInventory(
    @Body()
    body: {
      roomId: string;
      startDate: Date;
      endDate: Date;
      totalStock: number;
    },
  ) {
    return this.inventoryServiceService.generateInventory(body);
  }

  @Get('range')
  getInventoryRange(
    @Query('roomId') roomId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.inventoryServiceService.getInventoryRange({
      roomId,
      startDate,
      endDate,
    });
  }

  @Get('availability')
  checkAvailability(
    @Query('roomId') roomId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.inventoryServiceService.checkAvailability({
      roomId,
      checkIn,
      checkOut,
    });
  }

  @Post('lock')
  lockInventory(
    @Body()
    body: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    },
  ) {
    return this.inventoryServiceService.lockInventory(body);
  }

  @Post('confirm')
  confirmBooking(
    @Body()
    body: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    },
  ) {
    return this.inventoryServiceService.confirmBooking(body);
  }

  @Post('release')
  releaseInventory(
    @Body()
    body: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    },
  ) {
    return this.inventoryServiceService.releaseInventory(body);
  }

  @Patch('stop-sell')
  stopSell(
    @Body()
    body: {
      roomId: string;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.inventoryServiceService.stopSell(body);
  }

  @Patch('resume-sell')
  resumeSell(
    @Body()
    body: {
      roomId: string;
      startDate: Date;
      endDate: Date;
    },
  ) {
    return this.inventoryServiceService.resumeSell(body);
  }

  @Patch('stock')
  updateStock(
    @Body()
    body: {
      roomId: string;
      date: Date;
      totalStock: number;
    },
  ) {
    return this.inventoryServiceService.updateStock(body);
  }
}
