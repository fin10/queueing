import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

describe('TopicController', () => {
  const mockData = [{ name: 'test' }];
  const mockTopicService = {
    create: jest.fn().mockImplementation((topic) => Promise.resolve(topic)),
    getTopics: jest.fn().mockImplementation(() => Promise.resolve(mockData)),
  };

  let controller: TopicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    }).compile();

    controller = module.get(TopicController);
  });

  it('should be created topic', async () => {
    const topic = { userId: new mongoose.Schema.Types.ObjectId('test'), name: 'test' };
    await expect(controller.create(topic)).resolves.toStrictEqual(topic);
  });

  it('should get topics', async () => {
    await expect(controller.getTopics()).resolves.toStrictEqual(mockData);
  });
});
