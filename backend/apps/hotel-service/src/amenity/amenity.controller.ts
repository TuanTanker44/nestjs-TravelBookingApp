import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AmentityService } from './amenity.service';
import { CreateAmentityDto } from './dto/create-amenity.dto';
import { UpdateAmentityDto } from './dto/update-amenity.dto';

@Controller('amentity')
export class AmentityController {
  constructor(private readonly amentityService: AmentityService) {}

  @Post()
  async create(@Body() createAmentityDto: CreateAmentityDto) {
    return this.amentityService.create(createAmentityDto);
  }

  @Get()
  async findAll() {
    return this.amentityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.amentityService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAmentityDto: UpdateAmentityDto,
  ) {
    return this.amentityService.update(id, updateAmentityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.amentityService.remove(id);
  }
}
