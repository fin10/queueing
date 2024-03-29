import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema, collection: 'topics' }]),
    forwardRef(() => ArticleModule),
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
