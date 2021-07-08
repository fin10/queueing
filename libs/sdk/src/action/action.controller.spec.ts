import { Test } from '@nestjs/testing';
import { Request } from 'express';
import mongoose from 'mongoose';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';

describe(ActionController.name, () => {
  let controller: ActionController;

  const mockActionService = { putEmotion: async () => ({ like: 0, dislike: 0 }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ActionController,
        {
          provide: ActionService,
          useValue: mockActionService,
        },
      ],
    }).compile();

    controller = module.get(ActionController);
  });

  it('like a note', async () => {
    const req = { user: {} } as Request;
    const noteId = new mongoose.Types.ObjectId();
    jest.spyOn(mockActionService, 'putEmotion').mockResolvedValueOnce({ like: 1, dislike: 0 });

    const actual = await controller.like(req, noteId);

    expect(actual).toStrictEqual({ id: noteId, like: 1, dislike: 0 });
  });

  it('dislike a note', async () => {
    const req = { user: {} } as Request;
    const noteId = new mongoose.Types.ObjectId();
    jest.spyOn(mockActionService, 'putEmotion').mockResolvedValueOnce({ like: 0, dislike: 1 });

    const actual = await controller.dislike(req, noteId);

    expect(actual).toStrictEqual({ id: noteId, like: 0, dislike: 1 });
  });
});
