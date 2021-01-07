import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { TopicController } from './topic.controller';
import { TopicModelService } from './topic-model.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }])],
  controllers: [TopicController],
  providers: [TopicModelService],
})
export class TopicModule {}
