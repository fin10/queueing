import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { ArticleService } from './article.service';
import { User } from '../user/schemas/user.schema';
import { TopicService } from '../topic/topic.service';
import { ActionService } from '../action/action.service';
import { ProfileService } from '../profile/profile.service';
import { CommentService } from '../comment/comment.service';
import { Article, ArticleSchema } from './schemas/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigService } from '@nestjs/config';
import { ContentsService } from '../contents/contents.service';

describe('ArticleService', () => {
  let mongod: MongoMemoryServer;
  let service: ArticleService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'QUEUEING_NOTE_TTL') return 10;
      else if (key === 'QUEUEING_TITLE_MAX_LENGTH') return 50;
    }),
  };

  const mockTopicService = { getOrCreate: jest.fn() };
  const mockContentsService = {
    put: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  };
  const mockProfileService = { getProfile: jest.fn() };
  const mockActionService = { count: jest.fn() };
  const mockCommentService = { count: jest.fn() };

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri(), { useCreateIndex: true }),
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
      ],
      providers: [
        ArticleService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TopicService, useValue: mockTopicService },
        { provide: ActionService, useValue: mockActionService },
        { provide: ContentsService, useValue: mockContentsService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: CommentService, useValue: mockCommentService },
      ],
    }).compile();

    service = module.get(ArticleService);
  });

  afterEach(async () => {
    if (mongod) await mongod.stop();
  });

  it('create an article', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const nickname = 'test-user';
    const data = { title: 'test', topic: 'test-topic', body: 'text-body' };

    jest.spyOn(mockTopicService, 'getOrCreate').mockResolvedValueOnce({ name: data.topic });
    jest.spyOn(mockContentsService, 'get').mockResolvedValueOnce([data.body]);
    jest.spyOn(mockProfileService, 'getProfile').mockResolvedValueOnce({ name: nickname });

    const created = await service.create(user, data);

    expect(created.title).toBe(data.title);
    expect(created.topic).toBe(data.topic);
    expect(created.body).toStrictEqual([data.body]);
  });

  it('update an article', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const nickname = 'test-user';
    const data = { title: 'updated-title', topic: 'updated-topic', body: 'updated-body' };

    jest.spyOn(mockTopicService, 'getOrCreate').mockResolvedValueOnce({ name: 'topic' });
    jest.spyOn(mockContentsService, 'get').mockResolvedValueOnce(['body']);
    jest.spyOn(mockProfileService, 'getProfile').mockReturnValueOnce({ name: nickname });

    const created = await service.create(user, { title: 'title', topic: 'topic', body: 'body' });

    jest.spyOn(mockTopicService, 'getOrCreate').mockResolvedValueOnce({ name: data.topic });
    jest.spyOn(mockContentsService, 'get').mockResolvedValueOnce([data.body]);
    jest.spyOn(mockProfileService, 'getProfile').mockReturnValueOnce({ name: nickname });

    const updated = await service.update(user, created.id, data);

    expect(updated.id).toStrictEqual(created.id);
    expect(updated.creator).toBe(nickname);
    expect(updated.title).toBe(data.title);
    expect(updated.topic).toBe(data.topic);
    expect(updated.body).toStrictEqual([data.body]);
  });
});
