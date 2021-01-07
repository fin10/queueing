import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Topic } from './schemas/topic.schema';
import { TopicModelService } from './topic-model.service';

describe('TopicModelService', () => {
  const mockData = [{ name: 'test' }];
  const mockTopicModel = {
    create: jest.fn().mockImplementation((topic) => Promise.resolve(topic)),
    find: jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue(mockData),
    })),
  };

  let service: TopicModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Topic.name),
          useValue: mockTopicModel,
        },
        TopicModelService,
      ],
    }).compile();

    service = module.get(TopicModelService);
  });

  it('should be created topic', async () => {
    const topic = { name: 'test' };
    await expect(service.create(topic)).resolves.toStrictEqual(topic);
  });

  it('should get topics', async () => {
    await expect(service.getTopics()).resolves.toStrictEqual(mockData);
  });
});
