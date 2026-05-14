import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}
  async create(createHotelDto: CreateHotelDto) {
    const existedHotel = await this.hotelRepository.findOne({
      where: {
        name: createHotelDto.name,
        status: 'ACTIVE',
      },
    });

    if (existedHotel) {
      throw new ConflictException('Hotel already exists');
    }

    const hotel = this.hotelRepository.create({
      ...createHotelDto,
      rating_avg: 0,
      rating_count: 0,
      status: 'ACTIVE',
    });

    const newHotel = await this.hotelRepository.save(hotel);

    return newHotel;
  }

  findAll() {
    return this.hotelRepository.find({
      where: { status: 'ACTIVE' },
    });
  }

  findOne(id: string) {
    return this.hotelRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });
  }

  findByName(name: string) {
    return this.hotelRepository.findOne({
      where: { name, status: 'ACTIVE' },
    });
  }

  findByDescription(keyword: string) {
    return this.hotelRepository.find({
      where: {
        status: 'ACTIVE',
        description: Like(`%${keyword}%`),
      },
    });
  }

  findByAddress(keyword: string) {
    return this.hotelRepository.find({
      where: {
        status: 'ACTIVE',
        address: Like(`%${keyword}%`),
      },
    });
  }

  findByCity(city: string) {
    return this.hotelRepository.find({
      where: {
        status: 'ACTIVE',
        city: Like(`%${city}%`),
      },
    });
  }

  findByCountry(country: string) {
    return this.hotelRepository.find({
      where: {
        status: 'ACTIVE',
        country: Like(`%${country}%`),
      },
    });
  }

  findByRating(rating: number) {
    return this.hotelRepository.find({
      where: {
        status: 'ACTIVE',
        rating_avg: MoreThanOrEqual(rating),
      },
    });
  }

  findByPrice(price: number) {
    return this.hotelRepository
      .createQueryBuilder('hotel')
      .where('hotel.status = :status', { status: 'ACTIVE' })
      .andWhere('(hotel.price_min IS NULL OR hotel.price_min <= :price)', {
        price,
      })
      .andWhere('(hotel.price_max IS NULL OR hotel.price_max >= :price)', {
        price,
      })
      .getMany();
  }

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    const hotel = await this.hotelRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }

    if (updateHotelDto.name && updateHotelDto.name !== hotel.name) {
      const duplicatedHotel = await this.hotelRepository.findOne({
        where: { name: updateHotelDto.name, status: 'ACTIVE' },
      });

      if (duplicatedHotel) {
        throw new ConflictException('Hotel already exists');
      }
    }

    this.hotelRepository.merge(hotel, updateHotelDto);

    return this.hotelRepository.save(hotel);
  }

  async remove(id: string) {
    const hotel = await this.hotelRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }

    hotel.status = 'INACTIVE';

    return this.hotelRepository.save(hotel);
  }
}
