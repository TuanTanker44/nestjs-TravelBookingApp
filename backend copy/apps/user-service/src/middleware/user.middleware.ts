import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RoleMiddleware } from './role.middleware';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly roleMiddleware: RoleMiddleware,
    private readonly allowedRoles: string[],
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.roleMiddleware.checkRole(req, this.allowedRoles);

    next();
  }
}
