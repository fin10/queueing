import { Test } from '@nestjs/testing';
import { ArticleService } from '../article/article.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

describe(TopicController.name, () => {
  let controller: TopicController;

  const mockArticleService = { count: jest.fn() };
  const mockTopicService = { getTopics: jest.fn(), getNoteCountsByTopic: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TopicController,
        { provide: ArticleService, useValue: mockArticleService },
        { provide: TopicService, useValue: mockTopicService },
      ],
    }).compile();

    controller = module.get(TopicController);
  });

  it('get topics', async () => {
    jest.spyOn(mockArticleService, 'count').mockResolvedValueOnce(1);
    jest.spyOn(mockTopicService, 'getTopics').mockResolvedValueOnce([{ name: 'test' }]);
    jest.spyOn(mockTopicService, 'getNoteCountsByTopic').mockResolvedValueOnce({ test: 1 });

    const topics = await controller.getTopics();
    expect(topics.length).toBe(1);
    expect(topics[0].name).toBe('test');
    expect(topics[0].count).toBe(1);
  });
});
