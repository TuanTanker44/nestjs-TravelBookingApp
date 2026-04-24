import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { LocationService } from '../location/location.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    private readonly locationService: LocationService,
  ) {}
  async create(createHotelDto: CreateHotelDto) {
    const hotel = this.hotelRepository.create(createHotelDto);
    const newHotel = await this.hotelRepository.save(hotel);

    const location = {
      hotel_id: newHotel.id,
      status: newHotel.status,
      latitude: createHotelDto.latitude,
      longitude: createHotelDto.longitude,
    };

    await this.locationService.create(location);

    return newHotel;
  }

  findAll() {
    return this.hotelRepository.find();
  }

  findOne(id: string) {
    return this.hotelRepository.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.hotelRepository.findOne({ where: { name } });
  }

  findByDescription(keyword: string) {
    return this.hotelRepository.find({
      where: { description: Like(`%${keyword}%`) },
    });
  }

  findByAddress(keyword: string) {
    return this.hotelRepository.find({
      where: { address: Like(`%${keyword}%`) },
    });
  }

  findByCity(city: string) {
    return this.hotelRepository.find({ where: { city } });
  }

  findByCountry(country: string) {
    return this.hotelRepository.find({ where: { country } });
  }

  findByRating(rating: number) {
    return this.hotelRepository.find({
      where: {
        rating_avg: MoreThanOrEqual(rating),
      },
    });
  }

  findByPrice(price: number) {
    return this.hotelRepository.find({
      where: [
        { price_min: LessThanOrEqual(price) },
        { price_max: MoreThanOrEqual(price) },
      ],
    });
  }

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    return this.hotelRepository.update(id, updateHotelDto);
  }

  remove(id: string) {
    return this.hotelRepository.update(id, { status: 'INACTIVE' });
  }
}
