import { Controller, All, Req } from '@nestjs/common';

import type { Request } from 'express';

import { ProxyService } from './proxy.service';
import { SERVICES } from '../config/services.config';

@Controller()
export class ProxyController {
  constructor(private readonly proxy: ProxyService) {}

  @All('auth/*path')
  auth(@Req() req: Request) {
    return this.proxy.forward(SERVICES.AUTH, '/auth', req);
  }

  @All('users/*path')
  users(@Req() req: Request) {
    return this.proxy.forward(SERVICES.USER, '/users', req);
  }

  @All('hotels/*path')
  hotels(@Req() req: Request) {
    return this.proxy.forward(SERVICES.HOTEL, '/hotels', req);
  }

  @All('bookings/*path')
  bookings(@Req() req: Request) {
    return this.proxy.forward(SERVICES.BOOKING, '/bookings', req);
  }

  @All('payments/*path')
  payments(@Req() req: Request) {
    return this.proxy.forward(SERVICES.PAYMENT, '/payments', req);
  }

  @All('search/*path')
  search(@Req() req: Request) {
    return this.proxy.forward(SERVICES.SEARCH, '/search', req);
  }

  @All('inventory/*path')
  inventory(@Req() req: Request) {
    return this.proxy.forward(SERVICES.INVENTORY, '/inventory', req);
  }

  private forward(serviceUrl: string, prefix: string, req: Request) {
    const targetUrl = serviceUrl + req.originalUrl.replace(prefix, '');

    return this.proxy.forward(targetUrl, prefix, req);
  }
}
