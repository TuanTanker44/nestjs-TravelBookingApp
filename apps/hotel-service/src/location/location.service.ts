import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.save(createLocationDto);
  }

  findAll() {
    return this.locationRepository.find();
  }

  findOne(hotel_id: string) {
    return this.locationRepository.findOneBy({ hotel_id });
  }

  update(hotel_id: string, updateLocationDto: UpdateLocationDto) {
    return this.locationRepository.update({ hotel_id }, updateLocationDto);
  }

  remove(hotel_id: string) {
    return this.locationRepository.delete({ hotel_id });
  }
}
