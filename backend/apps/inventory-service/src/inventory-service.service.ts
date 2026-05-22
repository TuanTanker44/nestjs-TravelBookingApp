import { Injectable } from '@nestjs/common';

import { RoomInventoryService } from './room_inventory/room_inventory.service';

interface InventoryDateRangePayload {
  roomId: string;
  startDate: string | Date;
  endDate: string | Date;
}

interface InventoryLockPayload {
  roomId: string;
  checkIn: string | Date;
  checkOut: string | Date;
}

interface InventoryStockPayload {
  roomId: string;
  date: string | Date;
  totalStock: number;
}

interface InventoryGeneratePayload extends InventoryDateRangePayload {
  totalStock: number;
}

@Injectable()
export class InventoryServiceService {
  constructor(private readonly roomInventoryService: RoomInventoryService) {}

  getHello(): string {
    return 'Inventory service is running';
  }

  findAll() {
    return this.roomInventoryService.findAll();
  }

  findById(id: string) {
    return this.roomInventoryService.findById(id);
  }

  generateInventory(payload: InventoryGeneratePayload) {
    return this.roomInventoryService.generateInventory(
      payload.roomId,
      new Date(payload.startDate),
      new Date(payload.endDate),
      payload.totalStock,
    );
  }

  getInventoryRange(payload: InventoryDateRangePayload) {
    return this.roomInventoryService.getInventoryRange(
      payload.roomId,
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  checkAvailability(payload: InventoryLockPayload) {
    return this.roomInventoryService.checkAvailability(
      payload.roomId,
      new Date(payload.checkIn),
      new Date(payload.checkOut),
    );
  }

  lockInventory(payload: InventoryLockPayload) {
    return this.roomInventoryService.lockInventory(
      payload.roomId,
      new Date(payload.checkIn),
      new Date(payload.checkOut),
    );
  }

  confirmBooking(payload: InventoryLockPayload) {
    return this.roomInventoryService.confirmBooking(
      payload.roomId,
      new Date(payload.checkIn),
      new Date(payload.checkOut),
    );
  }

  releaseInventory(payload: InventoryLockPayload) {
    return this.roomInventoryService.releaseInventory(
      payload.roomId,
      new Date(payload.checkIn),
      new Date(payload.checkOut),
    );
  }

  stopSell(payload: InventoryDateRangePayload) {
    return this.roomInventoryService.stopSell(
      payload.roomId,
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  resumeSell(payload: InventoryDateRangePayload) {
    return this.roomInventoryService.resumeSell(
      payload.roomId,
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  updateStock(payload: InventoryStockPayload) {
    return this.roomInventoryService.updateStock(
      payload.roomId,
      new Date(payload.date),
      payload.totalStock,
    );
  }
}
