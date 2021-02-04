import { ExecutionContext } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class UserAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(UserAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request.isAuthenticated()) return true;

    try {
      const can = await super.canActivate(context);
      if (can) {
        await super.logIn(request);
        return true;
      }
    } catch (err) {
      this.logger.error(err.stack);
    }

    return false;
  }
}
