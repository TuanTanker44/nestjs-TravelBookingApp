import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { JwtGuard } from './jwt.guard';

import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [JwtModule.register(jwtConfig)],

  providers: [JwtGuard],

  exports: [JwtGuard],
})
export class AuthModule {}
