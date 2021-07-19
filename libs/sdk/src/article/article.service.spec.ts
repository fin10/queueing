import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { ArticleService } from './article.service';
import { User } from '../user/schemas/user.schema';
import { TopicService } from '../topic/topic.service';
import { ActionService } from '../action/action.service';
import { NoteBodyService } from '../note/note-body.service';
import { NoteService } from '../note/note.service';
import { ProfileService } from '../profile/profile.service';

describe('ArticleService', () => {
  let service: ArticleService;

  const mockTopicService = { getOrCreate: jest.fn() };
  const mockNoteService = {
    create: jest.fn(),
    update: jest.fn(),
    getNote: jest.fn(),
    count: jest.fn(),
  };
  const mockBodyService = {
    put: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  };
  const mockProfileService = { getProfile: jest.fn() };
  const mockActionService = { getEmotionCounts: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArticleService,
        { provide: TopicService, useValue: mockTopicService },
        { provide: NoteService, useValue: mockNoteService },
        { provide: ActionService, useValue: mockActionService },
        { provide: NoteBodyService, useValue: mockBodyService },
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    service = module.get(ArticleService);
  });

  it('create an article', async () => {
    const user = {} as User;
    const nickname = 'test-user';
    const data = { title: 'test', topic: 'test-topic', body: 'text-body' };
    const noteId = new mongoose.Types.ObjectId();

    jest.spyOn(mockTopicService, 'getOrCreate').mockResolvedValueOnce({ name: data.topic });
    jest.spyOn(mockNoteService, 'create').mockResolvedValueOnce(new mongoose.Types.ObjectId());
    jest
      .spyOn(mockNoteService, 'getNote')
      .mockResolvedValueOnce({ _id: noteId, title: data.title, topic: data.topic, get: jest.fn() });
    jest.spyOn(mockNoteService, 'count').mockResolvedValueOnce(0);
    jest.spyOn(mockBodyService, 'get').mockResolvedValueOnce([data.body]);
    jest.spyOn(mockProfileService, 'getProfile').mockResolvedValueOnce({ name: nickname });
    jest.spyOn(mockActionService, 'getEmotionCounts').mockResolvedValueOnce({ likes: 0, dislikes: 0 });

    const created = await service.create(user, data);
    expect(created.id).toBe(noteId);
    expect(created.title).toBe(data.title);
    expect(created.topic).toBe(data.topic);
    expect(created.body).toStrictEqual([data.body]);
  });

  it('update an article', async () => {
    const user = {} as User;
    const nickname = 'test-user';
    const data = { title: 'updated-title', topic: 'updated-topic', body: 'updated-body' };
    const noteId = new mongoose.Types.ObjectId();

    jest.spyOn(mockTopicService, 'getOrCreate').mockResolvedValueOnce({ name: data.topic });
    jest.spyOn(mockNoteService, 'create').mockResolvedValueOnce(new mongoose.Types.ObjectId());
    jest
      .spyOn(mockNoteService, 'getNote')
      .mockResolvedValueOnce({ _id: noteId, title: data.title, topic: data.topic, get: jest.fn() });
    jest.spyOn(mockNoteService, 'count').mockResolvedValueOnce(0);
    jest.spyOn(mockBodyService, 'get').mockResolvedValueOnce([data.body]);
    jest.spyOn(mockProfileService, 'getProfile').mockReturnValueOnce({ name: nickname });
    jest.spyOn(mockActionService, 'getEmotionCounts').mockResolvedValueOnce({ likes: 0, dislikes: 0 });

    const updated = await service.update(user, noteId, data);
    expect(updated.id).toBe(noteId);
    expect(updated.creator).toBe(nickname);
    expect(updated.title).toBe(data.title);
    expect(updated.topic).toBe(data.topic);
    expect(updated.body).toStrictEqual([data.body]);
  });
});
