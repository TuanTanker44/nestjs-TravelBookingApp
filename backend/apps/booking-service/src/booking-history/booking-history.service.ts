import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookingHistory } from './entities/booking-history.entity';

import { CreateBookingHistoryDto } from './dto/create-booking-history.dto';

import { BookingStatus } from './enums/booking-status.enum';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BookingHistoryService {
  constructor(
    @InjectRepository(BookingHistory)
    private historyRepository: Repository<BookingHistory>,
    private readonly redis: RedisService,
  ) {}

  /**
   * Tạo history record
   *
   * gọi khi booking status thay đổi
   */
  async create(dto: CreateBookingHistoryDto) {
    const {
      bookingId,
      userId,
      oldStatus,
      newStatus,
      reason,
      createdBy,
      metadata,
    } = dto;

    this.validateStatusTransition(oldStatus, newStatus);

    const history = this.historyRepository.create({
      bookingId,

      userId,

      oldStatus,

      newStatus,

      reason,

      createdBy,

      metadata,
    });

    return await this.historyRepository.save(history);
  }

  /**
   * Lấy toàn bộ history
   */
  async findAll() {
    const key = 'booking-history:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const histories = await this.historyRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    await this.redis.set(key, JSON.stringify(histories), 3600);

    return histories;
  }

  /**
   * Lịch sử 1 booking
   *
   * GET /booking-history/booking/:id
   */
  async findByBookingId(bookingId: string) {
    const key = `booking-history:booking:${bookingId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const histories = await this.historyRepository.find({
      where: {
        bookingId,
      },

      order: {
        createdAt: 'DESC',
      },
    });

    await this.redis.set(key, JSON.stringify(histories), 3600);

    return histories;
  }

  /**
   * Lịch sử booking của user
   */
  async findByUserId(userId: string) {
    const key = `booking-history:user:${userId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const histories = await this.historyRepository.find({
      where: {
        userId,
      },

      order: {
        createdAt: 'DESC',
      },
    });

    await this.redis.set(key, JSON.stringify(histories), 3600);

    return histories;
  }

  /**
   * lấy trạng thái mới nhất
   */
  async getLatestStatus(bookingId: string) {
    const key = `booking-history:latest:${bookingId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const history = await this.historyRepository.findOne({
      where: {
        bookingId,
      },

      order: {
        createdAt: 'DESC',
      },
    });

    if (!history) {
      throw new NotFoundException('Booking history not found');
    }

    const latestStatus = {
      bookingId,
      status: history.newStatus,
    };

    await this.redis.set(key, JSON.stringify(latestStatus), 3600);

    return latestStatus;
  }

  /**
   * Validate flow status
   */
  private validateStatusTransition(
    oldStatus?: BookingStatus,
    newStatus?: BookingStatus,
  ) {
    if (!oldStatus) {
      return;
    }

    const transitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,

        BookingStatus.CANCELLED,

        BookingStatus.EXPIRED,
      ],

      [BookingStatus.CONFIRMED]: [
        BookingStatus.CHECKED_IN,

        BookingStatus.CANCELLED,
      ],

      [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],

      [BookingStatus.CHECKED_OUT]: [],

      [BookingStatus.CANCELLED]: [],

      [BookingStatus.EXPIRED]: [],
    };

    const allowed = transitions[oldStatus] ?? [];

    if (!newStatus) {
      throw new BadRequestException(
        `Invalid status transition ${oldStatus} -> ${newStatus}`,
      );
    }

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition ${oldStatus} -> ${newStatus}`,
      );
    }
  }

  /**
   * Xóa history
   *
   * chỉ dùng admin/system
   */
  async remove(id: string) {
    const history = await this.historyRepository.findOne({
      where: {
        id,
      },
    });

    if (!history) {
      throw new NotFoundException('History not found');
    }

    await this.historyRepository.remove(history);

    await this.invalidateHistoryCache();

    return {
      message: 'History deleted',
    };
  }

  private async invalidateHistoryCache() {
    await this.redis.delPattern('booking-history:*');
  }
}
