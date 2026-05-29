import { Controller, Get, Query } from '@nestjs/common';

import { SearchRoomDto } from './dto/search-room.dto';
import { SearchServiceService } from './search-service.service';
import { SearchDto } from './dto/search.dto';

@Controller()
export class SearchServiceController {
  constructor(private readonly searchServiceService: SearchServiceService) {}

  @Get('search')
  search(@Query() query: SearchRoomDto) {
    return this.searchServiceService.searchRooms(query);
  }
  // =========================
  // SEARCH HOTEL
  // =========================
  @Get('/hotel')
  searchHotels(@Query() query: SearchDto) {
    return this.searchServiceService.searchHotels(query.keyword);
  }

  // =========================
  // SEARCH ROOM
  // =========================
  @Get('/room')
  searchRoomsByKeyword(@Query() query: SearchDto) {
    return this.searchServiceService.searchRoomsByKeyword(query);
  }
}
