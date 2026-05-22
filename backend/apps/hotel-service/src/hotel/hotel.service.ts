import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  private normalizeKeyword(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '');
  }

  private applyNormalizedLike(
    query: SelectQueryBuilder<Hotel>,
    field: string,
    keyword: string,
    alias = 'hotel',
  ): SelectQueryBuilder<Hotel> {
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

  async findByName(name: string) {
    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'name', name);

    return query.getOne();
  }

  async findByDescription(keyword: string) {
    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'description', keyword);

    return query.getMany();
  }

  async findByAddress(keyword: string) {
    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'address', keyword);

    return query.getMany();
  }

  async findByCity(city: string) {
    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'city', city);

    query.orderBy('hotel.rating_avg', 'DESC');

    return query.getMany();
  }

  async findByCountry(country: string) {
    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'country', country);

    return query.getMany();
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
  // =========================
  // SEARCH HOTEL
  // =========================
  async searchHotels(keyword?: string) {
    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    if (keyword) {
      const normalized = this.normalizeKeyword(keyword);

      query.andWhere(
        `
      REPLACE(LOWER(hotel.name), ' ', '')
      LIKE :keyword

      OR

      REPLACE(LOWER(hotel.city), ' ', '')
      LIKE :keyword

      OR

      REPLACE(LOWER(hotel.country), ' ', '')
      LIKE :keyword
      `,
        {
          keyword: `%${normalized}%`,
        },
      );
    }

    query.orderBy('hotel.rating_avg', 'DESC');

    return query.getMany();
  }
}
