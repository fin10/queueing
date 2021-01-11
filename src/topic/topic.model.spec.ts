import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RawTopic } from './schemas/topic.schema';
import { TopicModel } from './topic.model';

describe('TopicModel', () => {
  const mockData = [{ name: 'test' }];
  const mockTopicModel = {
    find: jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue(mockData),
    })),
  };

  let model: TopicModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(RawTopic.name),
          useValue: mockTopicModel,
        },
        TopicModel,
      ],
    }).compile();

    model = module.get(TopicModel);
  });

  // it('should be created topic', async () => {
  //   const topic = { name: 'test' };
  //   await expect(model.create(topic)).resolves.toBeUndefined();
  // });

  it('should get topics', async () => {
    await expect(model.getTopics()).resolves.toStrictEqual(mockData);
  });
});
