import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAmentityDto } from './dto/create-amentity.dto';
import { UpdateAmentityDto } from './dto/update-amentity.dto';
import { Amenity } from './entities/amentity.entity';

@Injectable()
export class AmentityService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async create(createAmentityDto: CreateAmentityDto) {
    const amenity = this.amenityRepository.create({
      ...createAmentityDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.amenityRepository.save(amenity);
  }

  async findAll() {
    return this.amenityRepository.find();
  }

  async findOne(id: number) {
    const amenity = await this.amenityRepository.findOne({ where: { id } });
    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }
    return amenity;
  }

  async update(id: number, updateAmentityDto: UpdateAmentityDto) {
    const amenity = await this.findOne(id);
    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }
    return this.amenityRepository.update(id, {
      ...updateAmentityDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: number) {
    const amenity = await this.findOne(id);
    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }
    return this.amenityRepository.delete(id);
  }
}
