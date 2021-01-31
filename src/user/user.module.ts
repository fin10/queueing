import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawUser, RawUserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: RawUser.name, schema: RawUserSchema, collection: 'users' }])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
