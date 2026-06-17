import { Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from '../../../schemas/user.schema';

@Injectable()
export class RoleMiddleware {
  checkRole(req: Partial<UserDocument>, allowedRoles: string[]): void {
    const user = { id: req._id, roles: req.roles };
    const userRoles = user?.roles;

    if (!user) {
      throw new ForbiddenException('Unauthenticated');
    }

    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      throw new ForbiddenException('Roles not found');
    }

    const allowed = userRoles.some((role) => allowedRoles.includes(role));
    if (!allowed) {
      throw new ForbiddenException('Access denied');
    }
  }
}
