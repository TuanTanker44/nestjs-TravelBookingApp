import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { AxiosError } from 'axios';

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

    const headers = {
      ...(req.headers as Record<string, any>),
    };
    const body: unknown = req.body;

    delete headers.host;
    delete headers['content-length'];

    if (req.user) {
      headers['x-user-id'] = (req.user as { sub: string }).sub;
    }

    try {
      const response = await firstValueFrom(
        this.http.request({
          url,
          method: req.method,
          headers,
          data: body,
        }),
      );

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<unknown>;

      console.log('message:', axiosError.message);

      console.log('status:', axiosError.response?.status);

      console.log('data:', axiosError.response?.data);

      throw new Error(
        `Error from '${serviceUrl}' service: ${axiosError.message}`,
      );
    }
  }
}
