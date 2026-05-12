import { BadRequestException, Injectable } from '@nestjs/common';

import { SearchRoomDto } from './dto/search-room.dto';

export interface SearchResultItem {
  hotelId: string;
  hotelName: string;
  city: string;
  roomType: string;
  facilities: string[];
  pricePerNight: number;
  rating: number;
  maxGuests: number;
  availableRooms: number;
  availableFrom: string;
  availableTo: string;
}

export interface SearchResult {
  query: SearchRoomDto;
  total: number;
  items: SearchResultItem[];
}

const HOTEL_CATALOG: SearchResultItem[] = [
  {
    hotelId: 'hotel-1',
    hotelName: 'Sunrise Bay Hotel',
    city: 'Da Nang',
    roomType: 'Deluxe',
    facilities: ['wifi', 'breakfast', 'pool'],
    pricePerNight: 1200000,
    rating: 4.7,
    maxGuests: 3,
    availableRooms: 12,
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    hotelId: 'hotel-2',
    hotelName: 'River View Resort',
    city: 'Da Lat',
    roomType: 'Suite',
    facilities: ['wifi', 'parking', 'spa'],
    pricePerNight: 1850000,
    rating: 4.9,
    maxGuests: 4,
    availableRooms: 8,
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    hotelId: 'hotel-3',
    hotelName: 'City Center Stay',
    city: 'Ho Chi Minh City',
    roomType: 'Standard',
    facilities: ['wifi', 'gym'],
    pricePerNight: 850000,
    rating: 4.2,
    maxGuests: 2,
    availableRooms: 20,
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

@Injectable()
export class SearchServiceService {
  searchRooms(query: SearchRoomDto): SearchResult {
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
    const requiredRooms = query.rooms ?? 1;

    const matches = HOTEL_CATALOG.filter((hotel) => {
      const cityMatch = !query.city || hotel.city === query.city;
      const roomTypeMatch = !query.roomType || hotel.roomType === query.roomType;
      const priceMinMatch =
        query.minPrice === undefined || hotel.pricePerNight >= query.minPrice;
      const priceMaxMatch =
        query.maxPrice === undefined || hotel.pricePerNight <= query.maxPrice;
      const ratingMatch =
        query.minRating === undefined || hotel.rating >= query.minRating;
      const guestMatch = guestCount <= hotel.maxGuests;
      const roomMatch = requiredRooms <= hotel.availableRooms;
      const availabilityMatch =
        checkIn >= new Date(hotel.availableFrom) &&
        checkOut <= new Date(hotel.availableTo);

      const facilitiesMatch =
        !query.facilities?.length ||
        query.facilities.every((facility) => hotel.facilities.includes(facility));

      return (
        cityMatch &&
        roomTypeMatch &&
        priceMinMatch &&
        priceMaxMatch &&
        ratingMatch &&
        guestMatch &&
        roomMatch &&
        availabilityMatch &&
        facilitiesMatch
      );
    });

    const sortBy = query.sortBy ?? 'ratingDesc';
    const sortedMatches = [...matches].sort((left, right) => {
      if (sortBy === 'priceAsc') {
        return left.pricePerNight - right.pricePerNight;
      }

      if (sortBy === 'priceDesc') {
        return right.pricePerNight - left.pricePerNight;
      }

      return right.rating - left.rating || left.pricePerNight - right.pricePerNight;
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
