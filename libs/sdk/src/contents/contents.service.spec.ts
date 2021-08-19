import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ContentsService } from './contents.service';
import { CacheModule } from '@nestjs/common';
import { ContentsEntity } from './contents.entity';

describe('ContentsService', () => {
  let service: ContentsService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'QUEUEING_NOTE_TTL') return 10;
      else if (key === 'QUEUEING_TITLE_MAX_LENGTH') return 50;
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CacheModule.register({ store: 'memory' })],
      providers: [ContentsService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = module.get(ContentsService);
  });

  it('put and get contents', async () => {
    const id = new mongoose.Types.ObjectId();
    const body = 'hello world';

    await service.put(id, body);
    const contents = await service.get(id);

    expect(contents).toStrictEqual([ContentsEntity.string('hello world')]);
  });

  it('remove contents', async () => {
    const id = new mongoose.Types.ObjectId();
    const body = 'will be removed';

    await service.put(id, body);
    await service.remove(id);
    const contents = await service.get(id);

    expect(contents).toBeUndefined();
  });
});
