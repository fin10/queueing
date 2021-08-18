import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ActionService } from '../action/action.service';
import { NoteBodyService } from '../note/note-body.service';
import { ProfileService } from '../profile/profile.service';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { ArticleRemovedEvent } from '../article/events/article-removed.event';

describe('CommentService', () => {
  let mongod: MongoMemoryServer;
  let service: CommentService;

  const mockBodyService = {
    put: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  };
  const mockProfileService = { getProfile: jest.fn() };
  const mockActionService = { count: jest.fn() };

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri(), { useCreateIndex: true }),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
      ],
      providers: [
        CommentService,
        { provide: ActionService, useValue: mockActionService },
        { provide: NoteBodyService, useValue: mockBodyService },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get(CommentService);
  });

  afterEach(async () => {
    if (mongod) await mongod.stop();
  });

  it('create a comment', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const nickname = 'test-user';
    const data = { articleId: new mongoose.Types.ObjectId(), body: 'text-body' };

    jest.spyOn(mockBodyService, 'get').mockResolvedValueOnce([data.body]);
    jest.spyOn(mockProfileService, 'getProfile').mockReturnValueOnce({ name: nickname });
    jest.spyOn(mockActionService, 'count').mockResolvedValueOnce(0);

    const created = await service.create(user, data);
    expect(created.creator).toBe(nickname);
    expect(created.articleId).toBe(data.articleId);
    expect(created.body).toStrictEqual([data.body]);
  });

  it('recevied a note removed event', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const data = { articleId: new mongoose.Types.ObjectId(), body: 'text-body' };

    jest.spyOn(mockBodyService, 'get').mockResolvedValueOnce([data.body]);
    jest.spyOn(mockProfileService, 'getProfile').mockReturnValueOnce({ name: 'test-user' });

    await service.create(user, data);

    const event = new ArticleRemovedEvent(data.articleId);
    await service.onArticleRemoved(event);

    const comments = await service.getComments(data.articleId);
    expect(comments.length).toBe(0);
  });
});
