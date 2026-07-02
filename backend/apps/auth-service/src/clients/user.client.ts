import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
}

@Injectable()
export class UserClient {
  private readonly userServiceUrl = 'http://localhost:3009/user';

  constructor(private readonly http: HttpService) {}

  /**
   * tìm user bằng email
   *
   * auth-service dùng khi login
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<AxiosResponse<User>>(
          `${this.userServiceUrl}/email/${email}`,
        ),
      );

      return (response as unknown as AxiosResponse<User>).data ?? null;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  /**
   * tìm user theo id
   *
   * dùng cho getMe
   */
  async findById(id: string): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<AxiosResponse<User>>(`${this.userServiceUrl}/${id}`),
      );

      return (response as unknown as AxiosResponse<User>).data ?? null;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }

  /**
   * tạo user
   *
   * register
   */
  async createUser(data: any): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<AxiosResponse<User>>(this.userServiceUrl, data),
    );

    return (response as unknown as AxiosResponse<User>).data;
  }
}
