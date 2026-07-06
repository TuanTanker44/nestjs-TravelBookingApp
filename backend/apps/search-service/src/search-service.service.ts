import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from './redis/redis.service';

import { SearchAvailableRoomDto } from './dto/search-available-room.dto';
import { firstValueFrom } from 'rxjs';
import { QuickSearchDto } from './dto/quick-search.dto';

export interface AvailableRoomItem {
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

export interface AvailableRoomSearchResult {
  query: SearchAvailableRoomDto;
  total: number;
  items: AvailableRoomItem[];
}

interface QuickSearchHotel {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  rating: number;
}

interface QuickSearchRoom {
  id: string;
  hotelId: string;
  name: string;
}

interface QuickSearchResult {
  hotels: QuickSearchHotel[];
}

@Injectable()
export class SearchServiceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly redis: RedisService,
  ) {}
  private readonly hotelServiceUrl = process.env.HOTEL_SERVICE_URL;

  private buildCacheKey(
    prefix: string,
    value: string | Record<string, unknown>,
  ) {
    if (typeof value === 'string') {
      return `${prefix}:${value.trim().toLowerCase().replace(/\s+/g, '')}`;
    }

    const params = new URLSearchParams();

    Object.entries(value)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, v]) => {
        params.set(key, Array.isArray(v) ? v.join(',') : String(v));
      });

    return `${prefix}:${params.toString()}`;
  }

  async searchAvailableRooms(
    dto: SearchAvailableRoomDto,
  ): Promise<AvailableRoomSearchResult> {
    const key = this.buildCacheKey(
      'search:available',
      dto as unknown as Record<string, unknown>,
    );

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as AvailableRoomSearchResult;
    }

    // =========================
    // Validate dates
    // =========================

    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('checkIn and checkOut must be valid dates');
    }

    if (checkIn >= checkOut) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const now = new Date();

    const upperBound = new Date(now);
    upperBound.setDate(now.getDate() + 7);

    if (checkIn < now || checkIn > upperBound) {
      throw new BadRequestException('checkIn must be within the next 7 days');
    }

    // =========================
    // Hotel filter
    // =========================

    /**
     * Sau này:
     *
     * const hotelIds = await this.hotelService.findHotels({
     *    city: dto.city,
     *    minRating: dto.minRating,
     * });
     *
     * Hiện tại tạm bỏ qua.
     */

    const guestCount = (dto.adults ?? 0) + (dto.children ?? 0);

    // =========================
    // Call Hotel Service
    // =========================

    const roomResponse = await firstValueFrom(
      this.httpService.post(`${this.hotelServiceUrl}/room/filter`, {
        // hotelIds,

        keyword: dto.keyword,

        roomType: dto.roomType,

        capacity: guestCount,

        minPrice: dto.minPrice,

        maxPrice: dto.maxPrice,

        amenities: dto.facilities,

        sortBy: dto.sortBy,

        order: dto.order,

        page: dto.page,

        limit: dto.limit,

        status: 'AVAILABLE',
      }),
    );

    const roomResult = roomResponse.data as {
      data: AvailableRoomItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };

    // =========================
    // Inventory check
    // =========================

    /**
     * Sau này:
     *
     * const inventory =
     *    await inventoryService.checkAvailability(...)
     *
     * const availableIds = ...
     *
     * const availableRooms =
     *    roomResult.data.filter(...)
     */

    const result: AvailableRoomSearchResult = {
      query: dto,

      total: roomResult.total,

      items: roomResult.data,
    };

    await this.redis.set(key, JSON.stringify(result), 3600);

    return result;
  }

  async quickSearch(dto: QuickSearchDto): Promise<QuickSearchResult> {
    const key = this.buildCacheKey('search:quick', dto.keyword ?? '');

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as QuickSearchResult;
    }

    // search hotel và room song song
    const [hotelResponse, roomResponse] = await Promise.all([
      firstValueFrom(
        this.httpService.get(`${this.hotelServiceUrl}/hotel/search`, {
          params: {
            keyword: dto.keyword,
            limit: dto.limit ?? 10,
          },
        }),
      ),

      firstValueFrom(
        this.httpService.get(`${this.hotelServiceUrl}/room/search`, {
          params: {
            keyword: dto.keyword,
            limit: dto.limit ?? 10,
          },
        }),
      ),
    ]);

    const hotels = hotelResponse.data as QuickSearchHotel[];

    const roomPayload = roomResponse.data as {
      data: QuickSearchRoom[];
    };

    // hotelId lấy từ room
    const hotelIdsFromRoom = [
      ...new Set(roomPayload.data.map((room) => room.hotelId)),
    ];

    let hotelsFromRoom: QuickSearchHotel[] = [];

    if (hotelIdsFromRoom.length > 0) {
      const response = await firstValueFrom(
        this.httpService.post(`${this.hotelServiceUrl}/hotel/search/ids`, {
          ids: hotelIdsFromRoom,
        }),
      );

      hotelsFromRoom = response.data as QuickSearchHotel[];
    }

    // merge + remove duplicate
    const hotelMap = new Map<string, QuickSearchHotel>();

    [...hotels, ...hotelsFromRoom].forEach((hotel) => {
      hotelMap.set(hotel.id, hotel);
    });

    const result: QuickSearchResult = {
      hotels: [...hotelMap.values()],
    };

    await this.redis.set(key, JSON.stringify(result), 300);

    return result;
  }
}
