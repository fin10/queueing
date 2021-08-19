import { forwardRef, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import paginate from 'mongoose-paginate-v2';
import { ActionModule } from '../action/action.module';
import { CommentModule } from '../comment/comment.module';
import { ContentsModule } from '../contents/contents.module';
import { PolicyModule } from '../policy/policy.module';
import { ProfileModule } from '../profile/profile.module';
import { TopicModule } from '../topic/topic.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleRemovedEvent } from './events/article-removed.event';
import { Article, ArticleDocument, ArticleSchema } from './schemas/article.schema';

@Module({
  imports: [
    ContentsModule,
    forwardRef(() => TopicModule),
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

          schema.post('remove', (doc: ArticleDocument) => {
            eventEmitter.emit(ArticleRemovedEvent.name, new ArticleRemovedEvent(doc._id));
          });

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
