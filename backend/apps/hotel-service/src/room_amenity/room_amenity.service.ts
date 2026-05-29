import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RoomAmenity } from './entities/room_amentity.entity';
import { CreateRoomAmenityDto } from './dto/create-room_amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room_amenity.dto';

@Injectable()
export class RoomAmenityService {
  constructor(
    @InjectRepository(RoomAmenity)
    private readonly roomAmenityRepository: Repository<RoomAmenity>,
  ) {}

  async create(
    createRoomAmenityDto: CreateRoomAmenityDto,
  ): Promise<RoomAmenity> {
    const roomAmenity = this.roomAmenityRepository.create(createRoomAmenityDto);
    return this.roomAmenityRepository.save(roomAmenity);
  }

  async findAll(): Promise<RoomAmenity[]> {
    return this.roomAmenityRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: string): Promise<RoomAmenity> {
    const roomAmenity = await this.roomAmenityRepository.findOne({
      where: { id },
    });

    if (!roomAmenity) {
      throw new NotFoundException(`RoomAmenity with id ${id} not found`);
    }

    return roomAmenity;
  }

  async findByRoomId(roomId: string): Promise<RoomAmenity[]> {
    return this.roomAmenityRepository.find({
      where: { roomId },
      order: { id: 'DESC' },
    });
  }

  async findByAmenityId(amenityId: number): Promise<RoomAmenity[]> {
    return this.roomAmenityRepository.find({
      where: { amenityId },
      order: { id: 'DESC' },
    });
  }

  async update(
    id: string,
    updateRoomAmenityDto: UpdateRoomAmenityDto,
  ): Promise<RoomAmenity> {
    const roomAmenity = await this.findOne(id);
    Object.assign(roomAmenity, updateRoomAmenityDto);
    return this.roomAmenityRepository.save(roomAmenity);
  }

  async remove(id: string): Promise<void> {
    const roomAmenity = await this.findOne(id);
    await this.roomAmenityRepository.remove(roomAmenity);
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
    if (!codes?.length) {
      return this.roomAmenityRepository.find();
    }
    const query = this.roomAmenityRepository.createQueryBuilder('roomAmenity');
    this.applyAmenityFilter(query, codes);
    return query.getMany();
  }
}
