import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { LocalizationModule } from '../localization/localization.module';
import { ReportingCreatedEvent } from './events/reporting-created.event';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { Reporting, ReportingDocument, ReportingSchema } from './schemas/reporting.schema';

@Module({
  imports: [
    ArticleModule,
    CommentModule,
    LocalizationModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: Reporting.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = ReportingSchema;

          schema.post('save', (doc: ReportingDocument) => {
            eventEmitter.emit(ReportingCreatedEvent.name, new ReportingCreatedEvent(doc._id));
          });

          return schema;
        },
        collection: 'reportings',
      },
    ]),
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService],
})
export class ReportingModule {}
