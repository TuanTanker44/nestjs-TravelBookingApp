import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { HotelService } from '../hotel/hotel.service';
import { RoomStatus } from './enums/room_status.enum';
import { SearchRoomDto } from './dto/search-room.dto';
import { RoomAmenityService } from '../room_amenity/room_amenity.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly hotelService: HotelService,
    private readonly roomAmenityService: RoomAmenityService,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const hotel = await this.hotelService.findOne(createRoomDto.hotelId);
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    const room = this.roomRepository.create({
      ...createRoomDto,
      type: createRoomDto.type
        ? (createRoomDto.type.toUpperCase() as Room['type'])
        : undefined,
      status: createRoomDto.status
        ? (createRoomDto.status.toUpperCase() as Room['status'])
        : undefined,
    });

    return this.roomRepository.save(room);
  }

  findAll() {
    return this.roomRepository.find();
  }

  findOne(id: string) {
    return this.roomRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);
    if (!room) {
      throw new Error('Room not found');
    }

    return this.roomRepository.update(id, {
      ...updateRoomDto,
      type: updateRoomDto.type
        ? (updateRoomDto.type.toUpperCase() as Room['type'])
        : undefined,
      status: updateRoomDto.status
        ? (updateRoomDto.status.toUpperCase() as Room['status'])
        : undefined,
    });
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    if (!room) {
      throw new Error('Room not found');
    }
    return this.roomRepository.update(id, { status: RoomStatus.UNAVAILABLE });
  }

  private baseQuery() {
    return this.roomRepository
      .createQueryBuilder('room')
      .where('room.status = :status', {
        status: 'ACTIVE',
      });
  }

  private normalizeKeyword(value: string | undefined): string {
    return value?.trim().toLowerCase().replace(/\s+/g, '') || '';
  }

  // Áp dụng LIKE với chuỗi đã chuẩn hóa
  private applyNormalizedLike(
    query: SelectQueryBuilder<Room>,
    field: string,
    keyword: string,
    alias = 'room',
  ): SelectQueryBuilder<Room> {
    const normalized = this.normalizeKeyword(keyword);

    return query.andWhere(
      `
      REPLACE(
        LOWER(${alias}.${field}),
        ' ',
        ''
      ) LIKE :keyword
      `,
      {
        keyword: `%${normalized}%`,
      },
    );
  }

  private roomKeywordSearch(query: SelectQueryBuilder<Room>, keyword?: string) {
    if (keyword) {
      this.applyNormalizedLike(query, 'name', keyword);
      this.applyNormalizedLike(query, 'description', keyword);
    }
  }

  private roomIntrinsicFilter(
    query: SelectQueryBuilder<Room>,
    type?: string,
    capacity?: number,
    name?: string,
    description?: string,
  ) {
    if (type) {
      this.applyNormalizedLike(query, 'type', type, 'room');
    }
    if (capacity) {
      query.andWhere('room.capacity = :capacity', { capacity });
    }
    if (name) {
      this.applyNormalizedLike(query, 'name', name, 'room');
    }
    if (description) {
      this.applyNormalizedLike(query, 'description', description, 'room');
    }
  }

  // private applyAvailabilityFilter(checkIn?: Date, checkOut?: Date) {}

  private applyAmenityFilter(amenities?: string[]) {
    return this.roomAmenityService.searchRoomAmenities(amenities || []);
  }

  private applyPriceFilter(
    query: SelectQueryBuilder<Room>,
    minPrice?: number,
    maxPrice?: number,
    priceLevel?: string,
  ) {
    if (minPrice) {
      query.andWhere('room.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      query.andWhere('room.price <= :maxPrice', { maxPrice });
    }
    if (priceLevel) {
      const levels: Record<string, [number, number]> = {
        budget: [0, 200],
        mid: [200, 500],
        luxury: [500, Number.MAX_SAFE_INTEGER],
      };
      const range = levels[priceLevel.toLowerCase()];
      if (range) {
        query.andWhere('room.price >= :minPrice AND room.price <= :maxPrice', {
          minPrice: range[0],
          maxPrice: range[1],
        });
      }
    }
  }

  async searchRooms(dto: SearchRoomDto) {
    const query = this.baseQuery();

    // hotel filter
    if (dto.hotelId) {
      query.andWhere('room.hotelId = :hotelId', {
        hotelId: dto.hotelId,
      });
    }

    // keyword search
    this.roomKeywordSearch(query, dto.keyword);

    // intrinsic filters
    this.roomIntrinsicFilter(query, dto.type, dto.capacity);

    // price filters
    this.applyPriceFilter(query, dto.minPrice, dto.maxPrice, dto.priceLevel);

    // amenity filters
    await this.applyAmenityFilter(dto.amenities);

    // availability filter
    // this.applyAvailabilityFilter(query, dto.checkIn, dto.checkOut);

    // status filter
    if (dto.status) {
      query.andWhere('room.status = :status', {
        status: dto.status,
      });
    }

    // sorting
    query.orderBy(`room.${dto.sortBy}`, dto.order);

    // pagination
    query.skip((dto.page - 1) * dto.limit);
    query.take(dto.limit);

    const [rooms, total] = await query.getManyAndCount();

    return {
      data: rooms,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }
}
