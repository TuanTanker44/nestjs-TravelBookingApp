import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseFloatPipe,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  @Get()
  findAll() {
    return this.hotelService.findAll();
  }

  @Get('search/name/:name')
  findByName(@Param('name') name: string) {
    return this.hotelService.findByName(name);
  }

  @Get('search/description/:keyword')
  findByDescription(@Param('keyword') keyword: string) {
    return this.hotelService.findByDescription(keyword);
  }

  @Get('search/address/:keyword')
  findByAddress(@Param('keyword') keyword: string) {
    return this.hotelService.findByAddress(keyword);
  }

  @Get('search/city/:city')
  findByCity(@Param('city') city: string) {
    return this.hotelService.findByCity(city);
  }

  @Get('search/country/:country')
  findByCountry(@Param('country') country: string) {
    return this.hotelService.findByCountry(country);
  }

  @Get('search/rating/:rating')
  findByRating(@Param('rating', ParseFloatPipe) rating: number) {
    return this.hotelService.findByRating(rating);
  }

  @Get('search/price/:price')
  findByPrice(@Param('price', ParseFloatPipe) price: number) {
    return this.hotelService.findByPrice(price);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelService.update(id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelService.remove(id);
  }
}
