import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { BookingRoomService } from './booking_room.service';

import { CreateBookingRoomDto } from './dto/create-booking_room.dto';
import { UpdateBookingRoomDto } from './dto/update-booking_room.dto';

@Controller('booking-rooms')
export class BookingRoomController {
  constructor(private readonly bookingRoomService: BookingRoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookingRoomDto: CreateBookingRoomDto) {
    return this.bookingRoomService.create(createBookingRoomDto);
  }

  @Get()
  findAll() {
    return this.bookingRoomService.findAll();
  }

  @Get('booking/:bookingId')
  findByBookingId(@Param('bookingId') bookingId: string) {
    return this.bookingRoomService.findByBookingId(bookingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingRoomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingRoomDto: UpdateBookingRoomDto,
  ) {
    return this.bookingRoomService.update(id, updateBookingRoomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.bookingRoomService.remove(id);
  }
}
