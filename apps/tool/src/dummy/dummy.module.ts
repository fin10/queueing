import { Module } from '@nestjs/common';
import { ClienDataFetcher } from './clien-data.fetcher';

@Module({
  providers: [ClienDataFetcher],
  exports: [ClienDataFetcher],
})
export class DummyModule {}
