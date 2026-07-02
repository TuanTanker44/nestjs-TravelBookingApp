import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { ProxyController, ProxyDevController } from './proxy.controller';

import { ProxyService } from './proxy.service';

import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],

  controllers: [ProxyDevController],

  providers: [ProxyService, JwtService],
})
export class ProxyModule {}
