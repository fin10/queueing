import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { NoteModule } from 'src/note/note.module';
import { RawAction, RawActionSchema } from './schemas/raw-action.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    NoteModule,
    MongooseModule.forFeature([
      {
        name: RawAction.name,
        schema: RawActionSchema,
        collection: 'actions',
      },
    ]),
  ],
  providers: [ActionService],
  controllers: [ActionController],
  exports: [ActionService],
})
export class ActionModule {}
