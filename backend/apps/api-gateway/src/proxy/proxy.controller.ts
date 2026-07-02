import { Controller, All, Req, UseGuards } from '@nestjs/common';

import type { Request } from 'express';

import { ProxyService } from './proxy.service';
import { SERVICES } from '../config/services.config';
import { JwtGuard } from '../auth/jwt.guard';
import { Public } from '../decorators/public.decorator';
import { SERVICES_DEV } from '../config/services-dev.config';

@Controller()
export class ProxyController {
  constructor(private readonly proxy: ProxyService) {}

  @Public()
  @All('auth/login')
  login(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @Public()
  @All('auth/register')
  register(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @Public()
  @All('auth/reset-password')
  resetPassword(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @Public()
  @All('auth/forgot-password')
  forgotPassword(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @Public()
  @All('auth/refresh')
  refresh(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @Public()
  @All('auth/verify-email')
  verifyEmail(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @Public()
  @All('auth/logout')
  logout(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @UseGuards(JwtGuard)
  @All('auth/*path')
  auth(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '', req);
  }

  @UseGuards(JwtGuard)
  @All('users/*path')
  users(@Req() req: Request) {
    return this.proxy.forward(SERVICES.USER, '', req);
  }

  @UseGuards(JwtGuard)
  @All('hotels/*path')
  hotels(@Req() req: Request) {
    return this.proxy.forward(SERVICES.HOTEL, '', req);
  }

  @UseGuards(JwtGuard)
  @All('bookings/*path')
  bookings(@Req() req: Request) {
    return this.proxy.forward(SERVICES.BOOKING, '', req);
  }

  @UseGuards(JwtGuard)
  @All('payments/*path')
  payments(@Req() req: Request) {
    return this.proxy.forward(SERVICES.PAYMENT, '', req);
  }

  @UseGuards(JwtGuard)
  @All('search/*path')
  search(@Req() req: Request) {
    return this.proxy.forward(SERVICES.SEARCH, '', req);
  }

  @UseGuards(JwtGuard)
  @All('inventory/*path')
  inventory(@Req() req: Request) {
    return this.proxy.forward(SERVICES.INVENTORY, '', req);
  }
}

@Controller()
export class ProxyDevController {
  constructor(private readonly proxy: ProxyService) {}

  // PUBLIC ROUTES

  @Public()
  @All('auth/login')
  login(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('auth/register')
  register(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('auth/reset-password')
  resetPassword(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('auth/forgot-password')
  forgotPassword(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('auth/refresh')
  refresh(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('auth/verify-email')
  verifyEmail(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('auth/logout')
  logout(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @Public()
  @All('search/*path')
  searchPublic(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.SEARCH, '', req);
  }

  @Public()
  @All('hotel/destinations/popular')
  hotelsPublic(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.HOTEL, '', req);
  }

  // PRIVATE ROUTES

  @UseGuards(JwtGuard)
  @All('auth/*path')
  auth(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.AUTH, '', req);
  }

  @UseGuards(JwtGuard)
  @All('user/*path')
  users(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.USER, '', req);
  }

  @UseGuards(JwtGuard)
  @All('hotel/*path')
  hotels(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.HOTEL, '', req);
  }

  @UseGuards(JwtGuard)
  @All('bookings/*path')
  bookings(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.BOOKING, '', req);
  }

  @UseGuards(JwtGuard)
  @All('payments/*path')
  payments(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.PAYMENT, '', req);
  }

  @UseGuards(JwtGuard)
  @All('inventory/*path')
  inventory(@Req() req: Request) {
    return this.proxy.forward(SERVICES_DEV.INVENTORY, '', req);
  }
}
