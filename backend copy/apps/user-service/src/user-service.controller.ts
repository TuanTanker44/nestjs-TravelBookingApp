import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.dto';
import { GetUserByAdminDto, GetUserDto } from './dto/get_user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(): Promise<GetUserDto[]> {
    return this.userService.getAllUsers();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.getUserById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() userId: string): Promise<GetUserDto> {
    return this.userService.getUserById(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  getUserByEmail(@Param('email') email: string): Promise<GetUserDto> {
    return this.userService.getUserByEmail(email);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    try {
      return await this.userService.updateUser(id, updateDto);
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  @Patch(':id/roles')
  async updateRoles(
    @Param('id') id: string,
    @Body('roles') roles: string[],
  ): Promise<GetUserByAdminDto> {
    return this.userService.updateRoles(id, roles);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<GetUserByAdminDto> {
    return this.userService.updateStatus(id, status);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.deleteUser(id);
  }
}
