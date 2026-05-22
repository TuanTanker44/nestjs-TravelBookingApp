import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomAmenity } from './entities/room_amentity.entity';
import { CreateRoomAmentityDto } from './dto/create-room_amentity.dto';
import { UpdateRoomAmentityDto } from './dto/update-room_amentity.dto';

@Injectable()
export class RoomAmentityService {
  constructor(
    @InjectRepository(RoomAmenity)
    private readonly roomAmenityRepository: Repository<RoomAmenity>,
  ) {}

  async create(
    createRoomAmentityDto: CreateRoomAmentityDto,
  ): Promise<RoomAmenity> {
    const roomAmenity = this.roomAmenityRepository.create(
      createRoomAmentityDto,
    );
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
    updateRoomAmentityDto: UpdateRoomAmentityDto,
  ): Promise<RoomAmenity> {
    const roomAmenity = await this.findOne(id);
    Object.assign(roomAmenity, updateRoomAmentityDto);
    return this.roomAmenityRepository.save(roomAmenity);
  }

  async remove(id: string): Promise<void> {
    const roomAmenity = await this.findOne(id);
    await this.roomAmenityRepository.remove(roomAmenity);
  }
}
