import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { Request } from 'express';
import { PoliciesGuard } from '../policy/policies.guard';
import { UserAuthGuard } from '../user/user-auth.guard';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

describe('ArticleController', () => {
  let controller: ArticleController;

  const mockArticleService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArticleController,
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    })
      .overrideGuard(UserAuthGuard)
      .useValue(true)
      .overrideGuard(PoliciesGuard)
      .useValue(true)
      .compile();

    controller = module.get(ArticleController);
  });

  it('create an article', async () => {
    const req = { user: {} } as Request;
    const data = { title: 'test', topic: 'test-topic', contents: 'text-body' };

    jest.spyOn(mockArticleService, 'create').mockResolvedValueOnce({
      id: new mongoose.Types.ObjectId(),
      creator: 'test-user',
      topic: data.topic,
      title: data.title,
      contents: [data.contents],
      created: new Date(),
      updated: new Date(),
      expireTime: new Date(),
      children: 0,
      likes: 0,
      dislikes: 0,
    });

    const created = await controller.create(req, data);
    expect(created.title).toBe(data.title);
    expect(created.topic).toBe(data.topic);
    expect(created.contents).toStrictEqual([data.contents]);
  });

  it('update an article', async () => {
    const req = { user: {} } as Request;
    const id = new mongoose.Types.ObjectId();
    const data = { title: 'test', topic: 'test-topic', contents: 'text-body' };

    jest.spyOn(mockArticleService, 'update').mockResolvedValueOnce({
      id,
      creator: 'test-user',
      topic: data.topic,
      title: data.title,
      contents: [data.contents],
      created: new Date(),
      updated: new Date(),
      expireTime: new Date(),
      children: 0,
      likes: 0,
      dislikes: 0,
    });

    const updated = await controller.update(req, id, data);
    expect(updated.id).toBe(id);
    expect(updated.title).toBe(data.title);
    expect(updated.topic).toBe(data.topic);
    expect(updated.contents).toStrictEqual([data.contents]);
  });

  it('remove an article', async () => {
    const noteId = new mongoose.Types.ObjectId();

    jest.spyOn(mockArticleService, 'remove').mockResolvedValueOnce([{ id: noteId }]);

    const removed = await controller.remove(noteId);
    expect(removed).toBe(noteId);
  });
});
