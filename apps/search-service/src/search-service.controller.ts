import { Controller, Get, Query } from '@nestjs/common';

import { SearchRoomDto } from './dto/search-room.dto';
import { SearchServiceService } from './search-service.service';

@Controller()
export class SearchServiceController {
  constructor(private readonly searchServiceService: SearchServiceService) {}

  @Get()
  @Get('search')
  search(@Query() query: SearchRoomDto) {
    return this.searchServiceService.searchRooms(query);
  }
}
