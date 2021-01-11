import { Test, TestingModule } from '@nestjs/testing';
import { NoteModel } from 'src/note/note-model.service';
import { TopicModel } from './topic.model';
import { TopicService } from './topic.service';

describe('TopicService', () => {
  const mockData = [{ name: 'test' }];
  const mockTopicModelService = {
    create: jest.fn().mockImplementation((topic) => Promise.resolve(topic)),
    getTopics: jest.fn().mockImplementation(() => Promise.resolve(mockData)),
  };

  let service: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: NoteModel,
          useValue: jest.fn(),
        },
        {
          provide: TopicModel,
          useValue: mockTopicModelService,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
