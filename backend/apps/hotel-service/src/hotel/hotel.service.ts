import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    private readonly redis: RedisService,
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

    await this.invalidateHotelCache();

    return newHotel;
  }

  async findAll() {
    const key = 'hotel:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const hotels = await this.hotelRepository.find({
      where: { status: 'ACTIVE' },
    });

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
  }

  async findOne(id: string) {
    const key = `hotel:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel;
    }
    const hotel = await this.hotelRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (hotel) {
      await this.redis.set(key, JSON.stringify(hotel), 3600);
    }

    return hotel;
  }

  async findByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    return this.hotelRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findByName(name: string) {
    const key = `hotel:name:${this.normalizeKeyword(name)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel;
    }

    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'name', name);

    const hotel = await query.getOne();

    if (hotel) {
      await this.redis.set(key, JSON.stringify(hotel), 3600);
    }

    return hotel;
  }

  async findByDescription(keyword: string) {
    const key = `hotel:description:${this.normalizeKeyword(keyword)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'description', keyword);

    const hotels = await query.getMany();

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
  }

  async findByAddress(keyword: string) {
    const key = `hotel:address:${this.normalizeKeyword(keyword)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'address', keyword);

    const hotels = await query.getMany();

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
  }

  async findByCity(city: string) {
    const key = `hotel:city:${this.normalizeKeyword(city)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'city', city);

    query.orderBy('hotel.rating_avg', 'DESC');

    const hotels = await query.getMany();

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
  }

  async findByCountry(country: string) {
    const key = `hotel:country:${this.normalizeKeyword(country)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const query = this.hotelRepository.createQueryBuilder('hotel');

    query.where('hotel.status = :status', {
      status: 'ACTIVE',
    });

    this.applyNormalizedLike(query, 'country', country);

    const hotels = await query.getMany();

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
  }

  async findByRating(rating: number) {
    const key = `hotel:rating:${rating}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const hotels = await this.hotelRepository.find({
      where: {
        status: 'ACTIVE',
        rating_avg: MoreThanOrEqual(rating),
      },
    });

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
  }

  async findByPrice(price: number) {
    const key = `hotel:price:${price}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const hotels = await this.hotelRepository
      .createQueryBuilder('hotel')
      .where('hotel.status = :status', { status: 'ACTIVE' })
      .andWhere('(hotel.price_min IS NULL OR hotel.price_min <= :price)', {
        price,
      })
      .andWhere('(hotel.price_max IS NULL OR hotel.price_max >= :price)', {
        price,
      })
      .getMany();

    await this.redis.set(key, JSON.stringify(hotels), 3600);

    return hotels;
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

    const updatedHotel = await this.hotelRepository.save(hotel);

    await this.invalidateHotelCache();

    return updatedHotel;
  }

  async remove(id: string) {
    const hotel = await this.hotelRepository.findOne({
      where: { id, status: 'ACTIVE' },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }

    hotel.status = 'INACTIVE';

    const removedHotel = await this.hotelRepository.save(hotel);

    await this.invalidateHotelCache();

    return removedHotel;
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
    if (!keyword?.trim()) {
      return;
    }
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

  // private applySorting(query: SelectQueryBuilder<Hotel>, dto: SearchHotelDto) {
  //   if (dto.sortBy) {
  //     const order = dto.order === 'DESC' ? 'DESC' : 'ASC';
  //     if (dto.sortBy === 'price') {
  //       query.orderBy('hotel.price_min', order);
  //     } else if (dto.sortBy === 'rating') {
  //       query.orderBy('hotel.rating_avg', order);
  //     }
  //   }
  // }

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
    const key = `hotel:search:${this.buildSearchCacheKey(dto)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Hotel[];
    }

    const query = this.baseQuery();

    this.applyKeywordSearch(query, dto.keyword ?? '');

    query.orderBy('hotel.rating_avg', 'DESC');

    query.take(dto.limit ?? 10);

    const hotels = await query.getMany();

    await this.redis.set(key, JSON.stringify(hotels), 300);

    return hotels;
  }

  private async invalidateHotelCache() {
    await this.redis.delPattern('hotel:*');
  }

  private buildSearchCacheKey(dto: SearchHotelDto) {
    const params = new URLSearchParams();

    Object.entries(dto)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      )
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .forEach(([key, value]) => {
        params.set(key, String(value));
      });

    return params.toString();
  }

  async getPopularDestinations(limit = 6) {
    const result = await this.hotelRepository
      .createQueryBuilder('hotel')
      .select('hotel.city', 'city')
      .addSelect('hotel.country', 'country')
      .addSelect('COUNT(hotel.id)', 'totalHotels')
      .groupBy('hotel.city')
      .addGroupBy('hotel.country')
      .orderBy('totalHotels', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(
      (item: { city: string; country: string; totalHotels: string }) => ({
        city: item.city,
        country: item.country,
        totalHotels: Number(item.totalHotels),
      }),
    );
  }
}
