import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis/redis.service';

import { SearchRoomDto } from './dto/search-room.dto';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { SearchDto } from './dto/search.dto';

export interface SearchResultItem {
  id: string;
  hotelId: string;
  name?: string;
  city: string;
  type: string;
  price: number;
  capacity: number;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResult {
  query: SearchRoomDto;
  total: number;
  items: SearchResultItem[];
}

@Injectable()
export class SearchServiceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly redis: RedisService,
  ) {}
  private readonly hotelServiceUrl =
    process.env.HOTEL_SERVICE_URL ?? 'http://localhost:3004';

  private buildCacheKey(prefix: string, value: string) {
    return `${prefix}:${value.trim().toLowerCase().replace(/\s+/g, '')}`;
  }

  private buildQueryCacheKey(prefix: string, query: SearchRoomDto | SearchDto) {
    const params = new URLSearchParams();

    Object.entries(query)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      )
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .forEach(([key, value]) => {
        params.set(key, Array.isArray(value) ? value.join(',') : String(value));
      });

    return `${prefix}:${params.toString()}`;
  }

  private mapRoom(room: Partial<SearchResultItem>): SearchResultItem {
    return {
      id: room.id ?? '',
      hotelId: room.hotelId ?? '',
      name: room.name,
      city: room.city ?? '',
      type: room.type ?? '',
      price: Number(room.price ?? 0),
      capacity: Number(room.capacity ?? 0),
      status: room.status ?? '',
      description: room.description,
      createdAt: room.createdAt ? new Date(room.createdAt) : new Date(),
      updatedAt: room.updatedAt ? new Date(room.updatedAt) : new Date(),
    };
  }

  private async fetchRoomCatalog(): Promise<SearchResultItem[]> {
    const key = 'search:room-catalog';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    // const hotelEndpoint = `${this.hotelServiceUrl}/hotels/search`;
    const roomEndpoint = `${this.hotelServiceUrl}/room`;

    // const hotels = await this.fetchHotelsByCity(query.city);

    // const hotelIds = hotels.map((hotel) => hotel.id);

    // if (!hotelIds.length) {
    //   return {
    //     total: 0,
    //     items: [],
    //   };
    // }

    let response: Response;
    try {
      response = await fetch(roomEndpoint);
    } catch {
      throw new ServiceUnavailableException(
        'Cannot connect to hotel-service room API',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Hotel-service room API returned status ${response.status}`,
      );
    }

    const payload = (await response.json()) as unknown;
    const rooms = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { data?: unknown[] }).data)
        ? (payload as { data: unknown[] }).data
        : [];

    const mappedRooms = rooms.map((room) =>
      this.mapRoom(room as Partial<SearchResultItem>),
    );

    await this.redis.set(key, JSON.stringify(mappedRooms), 3600);

    return mappedRooms;
  }

  async searchRooms(query: SearchRoomDto): Promise<SearchResult> {
    const key = this.buildQueryCacheKey('search:rooms', query);

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const checkIn = new Date(query.checkIn);
    const checkOut = new Date(query.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('checkIn and checkOut must be valid dates');
    }

    if (checkIn >= checkOut) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const now = new Date();
    const upperBound = new Date(now);
    upperBound.setDate(upperBound.getDate() + 7);

    if (checkIn < now || checkIn > upperBound) {
      throw new BadRequestException(
        'checkIn must be within the next 7 days from search time',
      );
    }

    const guestCount = (query.adults ?? 0) + (query.children ?? 0);
    const roomCatalog = await this.fetchRoomCatalog();

    const matches = roomCatalog.filter((room) => {
      const cityMatch =
        query.city || room.city.toLowerCase() === query.city.toLowerCase();
      const roomTypeMatch = !query.roomType || room.type === query.roomType;
      const priceMinMatch =
        query.minPrice === undefined || room.price >= query.minPrice;
      const priceMaxMatch =
        query.maxPrice === undefined || room.price <= query.maxPrice;
      const guestMatch = guestCount <= room.capacity;
      const statusMatch = room.status === 'available';

      return (
        cityMatch &&
        roomTypeMatch &&
        priceMinMatch &&
        priceMaxMatch &&
        guestMatch &&
        statusMatch
      );
    });

    const sortBy = query.sortBy ?? 'priceAsc';
    const sortedMatches = [...matches].sort((left, right) => {
      if (sortBy === 'priceAsc') {
        return left.price - right.price;
      }

      if (sortBy === 'priceDesc') {
        return right.price - left.price;
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    });

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const result = {
      query,
      total: sortedMatches.length,
      items: sortedMatches.slice(offset, offset + limit),
    };

    await this.redis.set(key, JSON.stringify(result), 3600);

    return result;
  }
  // =========================
  // SEARCH HOTEL
  // =========================
  async searchHotels(keyword?: string) {
    const key = this.buildCacheKey('search:hotel', keyword ?? '');

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const response = await firstValueFrom(
      this.httpService.get('http://hotel-service:3001/hotels/search', {
        params: {
          keyword,
        },
      }),
    );

    const result = response.data as SearchDto;

    await this.redis.set(key, JSON.stringify(result), 3600);

    return result;
  }

  // =========================
  // SEARCH ROOM
  // =========================
  async searchRoomsByKeyword(searchDto: SearchDto) {
    const key = this.buildQueryCacheKey('search:room', searchDto);

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const response = await firstValueFrom(
      this.httpService.get('http://hotel-service:3001/rooms/search', {
        params: {
          keyword: searchDto.keyword,
          amenities: searchDto.amenities,
        },
      }),
    );

    const result = response.data as SearchDto;

    await this.redis.set(key, JSON.stringify(result), 3600);

    return result;
  }
}
