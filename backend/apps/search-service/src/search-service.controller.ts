import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { SearchAvailableRoomDto } from './dto/search-available-room.dto';
import { SearchServiceService } from './search-service.service';
import { QuickSearchDto } from './dto/quick-search.dto';

@Controller('search')
export class SearchServiceController {
  constructor(private readonly searchServiceService: SearchServiceService) {}

  @Post('/available-rooms')
  async searchAvailableRooms(@Body() dto: SearchAvailableRoomDto) {
    return this.searchServiceService.searchAvailableRooms(dto);
  }

  @Get('/')
  async quickSearch(@Query() dto: QuickSearchDto): Promise<unknown> {
    return this.searchServiceService.quickSearch(dto);
  }
}
