import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawTopic, RawTopicSchema } from './schemas/topic.schema';
import { TopicController } from './topic.controller';
import { TopicModel } from './topic.model';
import { TopicService } from './topic.service';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: RawTopic.name, schema: RawTopicSchema }]), NoteModule],
  controllers: [TopicController],
  providers: [TopicModel, TopicService],
})
export class TopicModule {}
