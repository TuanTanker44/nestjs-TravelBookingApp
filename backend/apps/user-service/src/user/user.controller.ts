import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/role.enum';
import { UserStatus } from './enums/status.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('change-role/:id')
  async changeRole(
    @Param('id') id: string,
    @Body() { role }: { role: UserRole },
  ) {
    await this.userService.updateRole(id, role);
    return this.userService.findOne(id);
  }

  @Post('change-status/:id')
  async changeStatus(
    @Param('id') id: string,
    @Body() { status }: { status: string },
  ) {
    await this.userService.updateStatus(id, UserStatus[status]);
    return this.userService.findOne(id);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Get('phone/:phoneNumber')
  findOneByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.userService.findOneByPhoneNumber(phoneNumber);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('reactivate/:id')
  reActivate(@Param('id') id: string) {
    return this.userService.reActivate(id);
  }
}
