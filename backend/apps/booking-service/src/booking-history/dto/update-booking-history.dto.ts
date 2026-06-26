import { PartialType } from '@nestjs/swagger';
import { CreateBookingHistoryDto } from './create-booking-history.dto';

export class UpdateBookingHistoryDto extends PartialType(CreateBookingHistoryDto) {}
