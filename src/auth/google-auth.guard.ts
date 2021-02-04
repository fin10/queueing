import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

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
