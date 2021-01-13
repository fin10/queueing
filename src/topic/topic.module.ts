import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawTopic, RawTopicSchema } from './schemas/topic.schema';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RawTopic.name, schema: RawTopicSchema, collection: 'topics' }]),
    NoteModule,
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
