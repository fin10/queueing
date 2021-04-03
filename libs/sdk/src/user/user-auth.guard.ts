import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from './enums/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';
import { User } from './schemas/user.schema';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.isAuthenticated()) return false;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const user = request.user as User;
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
