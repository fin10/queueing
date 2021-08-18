import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import paginate from 'mongoose-paginate-v2';
import { ActionModule } from '../action/action.module';
import { CommentModule } from '../comment/comment.module';
import { NoteModule } from '../note/note.module';
import { PolicyModule } from '../policy/policy.module';
import { ProfileModule } from '../profile/profile.module';
import { TopicModule } from '../topic/topic.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article, ArticleSchema } from './schemas/article.schema';

@Module({
  imports: [
    NoteModule,
    TopicModule,
    ActionModule,
    ProfileModule,
    PolicyModule,
    CommentModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: Article.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = ArticleSchema;

          schema.plugin(paginate);

          return schema;
        },
        collection: 'articles',
      },
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
