import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAmentityDto } from './dto/create-amenity.dto';
import { UpdateAmentityDto } from './dto/update-amenity.dto';
import { Amenity } from './entities/amenity.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AmentityService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
    private readonly redis: RedisService,
  ) {}

  async create(createAmentityDto: CreateAmentityDto) {
    const amenity = this.amenityRepository.create({
      ...createAmentityDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdAmenity = await this.amenityRepository.save(amenity);

    await this.invalidateAmenityCache();

    return createdAmenity;
  }

  async findAll() {
    const key = 'amentity:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Amenity[];
    }

    const amenities = await this.amenityRepository.find();

    await this.redis.set(key, JSON.stringify(amenities), 3600);

    return amenities;
  }

  async findOne(id: number) {
    const key = `amentity:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Amenity;
    }

    const amenity = await this.amenityRepository.findOne({ where: { id } });
    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }

    await this.redis.set(key, JSON.stringify(amenity), 3600);

    return amenity;
  }

  async update(id: number, updateAmentityDto: UpdateAmentityDto) {
    const amenity = await this.findOne(id);
    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }
    const result = await this.amenityRepository.update(id, {
      ...updateAmentityDto,
      updatedAt: new Date(),
    });

    await this.invalidateAmenityCache();

    return result;
  }

  async remove(id: number) {
    const amenity = await this.findOne(id);
    if (!amenity) {
      throw new NotFoundException(`Amenity with id ${id} not found`);
    }

    const result = await this.amenityRepository.delete(id);

    await this.invalidateAmenityCache();

    return result;
  }

  async findByCodes(codes: string[]) {
    const key = `amentity:codes:${this.buildCodesCacheKey(codes)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Amenity[];
    }

    const amenities = await this.amenityRepository.find({
      where: {
        code: In(codes),
      },
    });

    await this.redis.set(key, JSON.stringify(amenities), 3600);

    return amenities;
  }

  private async invalidateAmenityCache() {
    await this.redis.delPattern('amentity:*');
  }

  private buildCodesCacheKey(codes: string[]) {
    return [...(codes || [])].sort().join('|');
  }
}
