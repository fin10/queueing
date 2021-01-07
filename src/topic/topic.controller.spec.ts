import { Test, TestingModule } from '@nestjs/testing';
import { TopicModelService } from './topic-model.service';
import { TopicController } from './topic.controller';

describe('TopicController', () => {
  const mockData = [{ name: 'test' }];
  const mockTopicModelService = {
    create: jest.fn().mockImplementation((topic) => Promise.resolve(topic)),
    getTopics: jest.fn().mockImplementation(() => Promise.resolve(mockData)),
  };

  let controller: TopicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicModelService,
          useValue: mockTopicModelService,
        },
      ],
    }).compile();

    controller = module.get<TopicController>(TopicController);
  });

  it('should be created topic', async () => {
    const topic = { name: 'test' };
    await expect(controller.create(topic)).resolves.toStrictEqual(topic);
  });

  it('should get topics', async () => {
    await expect(controller.getTopics()).resolves.toStrictEqual(mockData);
  });
});
