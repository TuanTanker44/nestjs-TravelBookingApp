import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RefreshToken } from './entities/refresh-token.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

import { UserClient } from './clients/user.client';
import { UserRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
}

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private userClient: UserClient,
  ) {}

  /**
   * validate email/password
   * dùng trong login
   */
  async validateIdentity(dto: LoginDto): Promise<User> {
    const user = await this.userClient.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matched = await bcrypt.compare(
      dto.password + process.env.PEPPER,
      user.passwordHash,
    );

    if (!matched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * register
   *
   * auth -> user-service
   */
  async register(dto: RegisterDto) {
    const exists = await this.userClient.findByEmail(dto.email);

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(
      dto.password + process.env.PEPPER,
      10,
    );

    const user = await this.userClient.createUser({
      email: dto.email,
      passwordHash,
      name: dto.fullName,
      phoneNumber: dto.phoneNumber,
      avatarUrl: dto.avatarUrl,
    });

    return {
      message: 'Register success',
      user,
    };
  }

  /**
   * login
   *
   * create:
   * - access token
   * - refresh token
   */
  async login(dto: LoginDto) {
    const user = await this.validateIdentity(dto);

    const accessToken = this.generateAccessToken(user);

    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken,

      refreshToken,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * generate jwt
   */
  private generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * tạo refresh token
   */
  private async createRefreshToken(userId: string) {
    const token = this.jwtService.sign(
      {
        sub: userId,
      },
      {
        expiresIn: '7d',
      },
    );

    const entity = this.refreshRepo.create({
      userId,

      token,

      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.refreshRepo.save(entity);

    return token;
  }

  /**
   * refresh access token
   */
  async refresh(dto: RefreshDto) {
    const stored = await this.refreshRepo.findOne({
      where: {
        token: dto.refreshToken,
      },
    });

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (stored.revoked) {
      throw new UnauthorizedException('Token revoked');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    const user = await this.userClient.findById(stored.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  /**
   * logout
   *
   * revoke refresh token
   */
  async revoke(token: string) {
    const refreshToken = await this.refreshRepo.findOne({
      where: {
        token,
      },
    });

    if (!refreshToken) {
      throw new BadRequestException('Token not found');
    }

    refreshToken.revoked = true;

    await this.refreshRepo.save(refreshToken);

    return {
      message: 'Logout successful',
    };
  }

  /**
   * get current user
   *
   * auth-service -> user-service
   */
  async getMe(userId: string) {
    const user = await this.userClient.findById(userId);

    return user;
  }
}
