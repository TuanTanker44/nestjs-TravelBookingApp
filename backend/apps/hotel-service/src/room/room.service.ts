import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelService } from '../hotel/hotel.service';
import { RoomStatus } from './enums/room_status.enum';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly hotelService: HotelService,
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

  remove(id: string) {
    return this.roomRepository.update(id, { status: RoomStatus.UNAVAILABLE });
  }

  // =========================
  // SEARCH ROOM + AMENITY
  // =========================
  async searchRooms(keyword?: string, amenities?: string[]) {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.amenities', 'amenity');

    // =========================
    // SEARCH ROOM NAME / TYPE
    // =========================
    if (keyword) {
      query.andWhere(
        `
        (
          LOWER(room.name) LIKE LOWER(:keyword)
          OR LOWER(room.type) LIKE LOWER(:keyword)
        )
        `,
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    // =========================
    // FILTER AMENITIES
    // =========================
    if (amenities && amenities.length > 0) {
      query
        .andWhere('amenity.code IN (:...amenities)', {
          amenities,
        })
        .groupBy('room.id')
        .having('COUNT(DISTINCT amenity.id) = :count', {
          count: amenities.length,
        });
    }

    // =========================
    // ROOM STATUS
    // =========================
    query.andWhere('room.status = :status', {
      status: 'AVAILABLE',
    });

    query.orderBy('room.price', 'ASC');

    return query.getMany();
  }
}
