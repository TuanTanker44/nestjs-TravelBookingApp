import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ProxyService {
  constructor(private readonly http: HttpService) {}

  async forward(
    serviceUrl: string,
    prefix: string,
    req: Request,
  ): Promise<unknown> {
    const original = req.originalUrl ?? '';
    const path = original.replace(prefix, '');

    const url = serviceUrl + path;

    const response = await firstValueFrom(
      this.http.request({
        url,
        method: req.method,
        headers: {
          ...(req.headers as Record<string, any>),
          // remove host of gateway
          host: undefined,
        },
        data: req.body as unknown,
      }),
    );

    return response.data as unknown;
  }
}
