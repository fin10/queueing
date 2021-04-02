import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PenaltyService } from './penalty.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection: 'users' }])],
  controllers: [UserController],
  providers: [UserService, PenaltyService],
  exports: [UserService],
})
export class UserModule {}
