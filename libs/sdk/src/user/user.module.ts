import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalizationModule } from '../localization/localization.module';
import { PenaltyService } from './penalty.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users',
      },
    ]),
    LocalizationModule,
  ],
  controllers: [UserController],
  providers: [UserService, PenaltyService],
  exports: [UserService],
})
export class UserModule {}
