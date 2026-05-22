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
import { SearchHotelDto } from './dto/search-hotel.dto';

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

  // Search and filter implementation
  private normalizeKeyword(value: string | undefined): string {
    return value?.trim().toLowerCase().replace(/\s+/g, '') || '';
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

  private baseQuery() {
    return this.hotelRepository
      .createQueryBuilder('hotel')
      .where('hotel.status = :status', {
        status: 'ACTIVE',
      });
  }

  // Keyword search across name, description, and address
  private applyKeywordSearch(
    query: SelectQueryBuilder<Hotel>,
    keyword: string,
  ) {
    const normalized = this.normalizeKeyword(keyword);

    query.andWhere(
      `
    (
      REPLACE(LOWER(hotel.name), ' ', '') LIKE :keyword
      OR REPLACE(LOWER(hotel.description), ' ', '') LIKE :keyword
      OR REPLACE(LOWER(hotel.country), ' ', '') LIKE :keyword
      OR REPLACE(LOWER(hotel.city), ' ', '') LIKE :keyword
      OR REPLACE(LOWER(hotel.address), ' ', '') LIKE :keyword
    )
    `,
      {
        keyword: `%${normalized}%`,
      },
    );
  }
  private applyLocationFilter(
    query: SelectQueryBuilder<Hotel>,
    city?: string,
    country?: string,
    address?: string,
  ) {
    if (city) {
      const normalizedCity = this.normalizeKeyword(city);

      query.andWhere(
        `
      REPLACE(LOWER(hotel.city), ' ', '') LIKE :city
      `,
        {
          city: `%${normalizedCity}%`,
        },
      );
    }

    if (country) {
      const normalizedCountry = this.normalizeKeyword(country);

      query.andWhere(
        `
      REPLACE(LOWER(hotel.country), ' ', '') LIKE :country
      `,
        {
          country: `%${normalizedCountry}%`,
        },
      );
    }

    if (address) {
      const normalizedAddress = this.normalizeKeyword(address);

      query.andWhere(
        `
      REPLACE(LOWER(hotel.address), ' ', '') LIKE :address
      `,
        {
          address: `%${normalizedAddress}%`,
        },
      );
    }

    return query;
  }

  private applyRatingFilter(query: SelectQueryBuilder<Hotel>, rating: number) {
    query.andWhere('hotel.rating_avg >= :rating', {
      rating,
    });
  }

  private applyPriceFilter(
    query: SelectQueryBuilder<Hotel>,
    minPrice?: number,
    maxPrice?: number,
  ) {
    if (minPrice !== undefined) {
      query.andWhere('hotel.price_max >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice !== undefined) {
      query.andWhere('hotel.price_min <= :maxPrice', {
        maxPrice,
      });
    }

    return query;
  }

  private applySorting(query: SelectQueryBuilder<Hotel>, dto: SearchHotelDto) {
    if (dto.sortBy) {
      const order = dto.order === 'DESC' ? 'DESC' : 'ASC';
      if (dto.sortBy === 'price') {
        query.orderBy('hotel.price_min', order);
      } else if (dto.sortBy === 'rating') {
        query.orderBy('hotel.rating_avg', order);
      }
    }
  }

  private applyPagination(
    query: SelectQueryBuilder<Hotel>,
    dto: SearchHotelDto,
  ) {
    const page = dto.page && dto.page > 0 ? dto.page : 1;
    const limit = dto.limit && dto.limit > 0 ? dto.limit : 10;
    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);
  }

  async search(dto: SearchHotelDto) {
    const query = this.baseQuery();

    if (dto.keyword) {
      this.applyKeywordSearch(query, dto.keyword);
    }

    this.applyLocationFilter(query, dto.city, dto.country, dto.address);

    if (dto.minRating) {
      this.applyRatingFilter(query, dto.minRating);
    }

    this.applyPriceFilter(query, dto.minPrice, dto.maxPrice);

    this.applySorting(query, dto);

    this.applyPagination(query, dto);

    return query.getMany();
  }
}
