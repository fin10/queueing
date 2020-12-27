import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueingConfigModule } from 'src/config/queueing-config.module';
import { NoteBodyService } from './note-body.service';

describe('NoteBodyService', () => {
  let service: NoteBodyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register(), QueueingConfigModule],
      providers: [NoteBodyService],
    }).compile();

    service = module.get<NoteBodyService>(NoteBodyService);
  });

  it('should be stored', async () => {
    const body = 'test';
    const key = await service.put(body);
    const stored = await service.get(key);
    expect(stored).toStrictEqual(body);
  });
});
