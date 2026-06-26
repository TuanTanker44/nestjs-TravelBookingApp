import { Controller, Post, Body, Get, Headers, Res } from '@nestjs/common';
import type { Response } from 'express';

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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
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
