import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueingConfigService } from './queueing-config.service';

describe('QueueingConfigService', () => {
  let service: QueueingConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, QueueingConfigService],
    }).compile();

    service = module.get<QueueingConfigService>(QueueingConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
