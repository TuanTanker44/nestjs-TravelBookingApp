import { Controller, Post, Body, Get, Headers } from '@nestjs/common';

import { AuthServiceService } from './auth-service.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  /**
   * POST /auth/register
   *
   * Client -> Gateway -> Auth Service
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/refresh
   */
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  /**
   * POST /auth/logout
   */
  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    return this.authService.revoke(dto.refreshToken);
  }

  /**
   * GET /auth/me
   *
   * Gateway verify JWT trước
   * rồi truyền userId xuống header
   *
   * x-user-id: uuid
   */
  @Get('me')
  async me(@Headers('x-user-id') userId: string) {
    return this.authService.getMe(userId);
  }
}
