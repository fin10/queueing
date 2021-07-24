import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { Request } from 'express';
import { PoliciesGuard } from '../policy/policies.guard';
import { UserAuthGuard } from '../user/user-auth.guard';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

describe(ArticleController.name, () => {
  let controller: ArticleController;

  const mockArticleService = {
    create: async () => undefined,
    update: async () => undefined,
    remove: async () => undefined,
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
    const data = { title: 'test', topic: 'test-topic', body: 'text-body' };

    jest.spyOn(mockArticleService, 'create').mockResolvedValueOnce({
      id: new mongoose.Types.ObjectId(),
      creator: 'test-user',
      topic: data.topic,
      title: data.title,
      body: [data.body],
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
    expect(created.body).toStrictEqual([data.body]);
  });

  it('update an article', async () => {
    const req = { user: {} } as Request;
    const id = new mongoose.Types.ObjectId();
    const data = { title: 'test', topic: 'test-topic', body: 'text-body' };

    jest.spyOn(mockArticleService, 'update').mockResolvedValueOnce({
      id,
      creator: 'test-user',
      topic: data.topic,
      title: data.title,
      body: [data.body],
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
    expect(updated.body).toStrictEqual([data.body]);
  });

  it('remove an article', async () => {
    const noteId = new mongoose.Types.ObjectId();

    jest.spyOn(mockArticleService, 'remove').mockResolvedValueOnce([{ id: noteId }]);

    const removed = await controller.remove(noteId);
    expect(removed).toBe(noteId);
  });
});
