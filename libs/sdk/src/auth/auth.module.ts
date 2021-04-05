import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { GoogleStrategy } from './google.strategy';
import { UserSerializer } from './user.serializer';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, GoogleStrategy, LocalStrategy, UserSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
