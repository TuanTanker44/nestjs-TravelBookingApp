import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoomAmenity } from './entities/room_amentity.entity';
import { CreateRoomAmenityDto } from './dto/create-room_amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room_amenity.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoomAmenityService {
  constructor(
    @InjectRepository(RoomAmenity)
    private readonly roomAmenityRepository: Repository<RoomAmenity>,
    private readonly redis: RedisService,
  ) {}

  async create(
    createRoomAmenityDto: CreateRoomAmenityDto,
  ): Promise<RoomAmenity> {
    const roomAmenity = this.roomAmenityRepository.create(createRoomAmenityDto);

    const createdRoomAmenity =
      await this.roomAmenityRepository.save(roomAmenity);

    await this.invalidateRoomAmenityCache();

    return createdRoomAmenity;
  }

  async findAll(): Promise<RoomAmenity[]> {
    const key = 'room-amenity:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomAmenity[];
    }

    const roomAmenities = await this.roomAmenityRepository.find({
      order: { id: 'DESC' },
    });

    await this.redis.set(key, JSON.stringify(roomAmenities), 3600);

    return roomAmenities;
  }

  async findOne(id: string): Promise<RoomAmenity> {
    const key = `room-amenity:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomAmenity;
    }

    const roomAmenity = await this.roomAmenityRepository.findOne({
      where: { id },
    });

    if (!roomAmenity) {
      throw new NotFoundException(`RoomAmenity with id ${id} not found`);
    }

    await this.redis.set(key, JSON.stringify(roomAmenity), 3600);

    return roomAmenity;
  }

  async findByRoomId(roomId: string): Promise<RoomAmenity[]> {
    const key = `room-amenity:room:${roomId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomAmenity[];
    }

    const roomAmenities = await this.roomAmenityRepository.find({
      where: { roomId },
      order: { id: 'DESC' },
    });

    await this.redis.set(key, JSON.stringify(roomAmenities), 3600);

    return roomAmenities;
  }

  async findByAmenityId(amenityId: number): Promise<RoomAmenity[]> {
    const key = `room-amenity:amenity:${amenityId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomAmenity[];
    }

    const roomAmenities = await this.roomAmenityRepository.find({
      where: { amenityId },
      order: { id: 'DESC' },
    });

    await this.redis.set(key, JSON.stringify(roomAmenities), 3600);

    return roomAmenities;
  }

  async update(
    id: string,
    updateRoomAmenityDto: UpdateRoomAmenityDto,
  ): Promise<RoomAmenity> {
    const roomAmenity = await this.findOne(id);
    Object.assign(roomAmenity, updateRoomAmenityDto);

    const updatedRoomAmenity =
      await this.roomAmenityRepository.save(roomAmenity);

    await this.invalidateRoomAmenityCache();

    return updatedRoomAmenity;
  }

  async remove(id: string): Promise<void> {
    const roomAmenity = await this.findOne(id);
    await this.roomAmenityRepository.remove(roomAmenity);

    await this.invalidateRoomAmenityCache();
  }

  private applyAmenityFilter(
    query: SelectQueryBuilder<RoomAmenity>,
    codes?: string[],
  ) {
    if (!codes?.length) {
      return query;
    }

    return query
      .leftJoin('room.amenities', 'amenity')
      .andWhere('amenity.code IN (:...codes)', { codes })
      .groupBy('room.id')
      .having('COUNT(DISTINCT amenity.id) = :count', { count: codes.length });
  }

  async applyAmenityFilterWithRooms(
    query: SelectQueryBuilder<RoomAmenity>,
    codes?: string[],
  ) {
    if (!codes?.length) {
      return query.getMany();
    }
    this.applyAmenityFilter(query, codes);
    return query.getMany();
  }

  async searchRoomAmenities(codes: string[]): Promise<RoomAmenity[]> {
    const key = `room-amenity:codes:${this.buildCodesCacheKey(codes)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as RoomAmenity[];
    }

    if (!codes?.length) {
      const roomAmenities = await this.roomAmenityRepository.find();

      await this.redis.set(key, JSON.stringify(roomAmenities), 3600);

      return roomAmenities;
    }
    const query = this.roomAmenityRepository.createQueryBuilder('roomAmenity');
    this.applyAmenityFilter(query, codes);

    const roomAmenities = await query.getMany();

    await this.redis.set(key, JSON.stringify(roomAmenities), 3600);

    return roomAmenities;
  }

  private async invalidateRoomAmenityCache() {
    await this.redis.delPattern('room-amenity:*');
  }

  private buildCodesCacheKey(codes: string[]) {
    return [...(codes || [])].sort().join('|');
  }
}
