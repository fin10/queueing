import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { PoliciesGuard } from '../policy/policies.guard';
import { UserAuthGuard } from '../user/user-auth.guard';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

describe(ArticleController.name, () => {
  let controller: ArticleController;

  const mockArticleService = { remove: async () => undefined };

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

  it('remove an article', async () => {
    const noteId = new mongoose.Types.ObjectId();

    jest.spyOn(mockArticleService, 'remove').mockResolvedValueOnce([{ id: noteId }]);

    const removed = await controller.remove(noteId);
    expect(removed.id).toBe(noteId);
  });
});
