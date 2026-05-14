import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { SearchRoomDto } from './dto/search-room.dto';

export interface SearchResultItem {
  id: string;
  hotelId: string;
  name?: string;
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
  private readonly hotelServiceUrl =
    process.env.HOTEL_SERVICE_URL ?? 'http://localhost:3004';

  private mapRoom(room: Partial<SearchResultItem>): SearchResultItem {
    return {
      id: room.id ?? '',
      hotelId: room.hotelId ?? '',
      name: room.name,
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
    const endpoint = `${this.hotelServiceUrl}/room`;

    let response: Response;
    try {
      response = await fetch(endpoint);
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

    return rooms.map((room) => this.mapRoom(room as Partial<SearchResultItem>));
  }

  async searchRooms(query: SearchRoomDto): Promise<SearchResult> {
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
      const roomTypeMatch = !query.roomType || room.type === query.roomType;
      const priceMinMatch =
        query.minPrice === undefined || room.price >= query.minPrice;
      const priceMaxMatch =
        query.maxPrice === undefined || room.price <= query.maxPrice;
      const guestMatch = guestCount <= room.capacity;
      const statusMatch = room.status === 'available';

      return (
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

    return {
      query,
      total: sortedMatches.length,
      items: sortedMatches.slice(offset, offset + limit),
    };
  }
}
