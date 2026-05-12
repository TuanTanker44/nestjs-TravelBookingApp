export class SearchRoomDto {
  city?: string;

  checkIn!: string;

  checkOut!: string;

  adults!: number;

  children?: number;

  rooms?: number;

  minPrice?: number;

  maxPrice?: number;

  minRating?: number;

  facilities?: string[];

  roomType?: string;

  sortBy?: string;

  page?: number;

  limit?: number;
}
