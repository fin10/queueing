import { Test } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

describe(TopicController.name, () => {
  let controller: TopicController;

  const mockTopicService = { getTopics: async () => [], getNoteCountsByTopic: async () => ({}) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TopicController,
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    }).compile();

    controller = module.get(TopicController);
  });

  it('get topics', async () => {
    const name = 'test';
    const count = 1;

    jest.spyOn(mockTopicService, 'getTopics').mockResolvedValueOnce([{ name }]);
    jest.spyOn(mockTopicService, 'getNoteCountsByTopic').mockResolvedValueOnce({ [name]: count });

    const topics = await controller.getTopics();
    expect(topics.length).toBe(1);
    expect(topics[0].name).toBe(name);
    expect(topics[0].count).toBe(count);
  });
});
