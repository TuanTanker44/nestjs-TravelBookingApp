import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtGuard } from './jwt.guard';

import { jwtConfig } from '../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule.register(jwtConfig)],

  providers: [JwtStrategy, JwtGuard],

  exports: [JwtGuard],
})
export class AuthModule {}
