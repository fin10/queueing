import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ActionService } from './action.service';
import { EmotionType } from './enums/emotion-type.enum';
import { Action, ActionSchema } from './schemas/action.schema';

describe(ActionService.name, () => {
  let mongod: MongoMemoryServer;
  let service: ActionService;

  const createTestUser = jest.fn().mockReturnValue({ _id: new mongoose.Types.ObjectId() } as User);

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri(), { useCreateIndex: true }),
        MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
      ],
      providers: [ActionService],
    }).compile();

    service = module.get(ActionService);
  });

  afterEach(async () => {
    if (mongod) await mongod.stop();
  });

  it('put like emotion', async () => {
    const user = createTestUser();
    const noteId = new mongoose.Types.ObjectId();

    const actual = await service.putEmotion(user, noteId, EmotionType.LIKE);

    expect(actual).toStrictEqual({ likes: 1, dislikes: 0 });
  });

  it('put dislike emotion', async () => {
    const user = createTestUser();
    const noteId = new mongoose.Types.ObjectId();

    const actual = await service.putEmotion(user, noteId, EmotionType.DISLIKE);

    expect(actual).toStrictEqual({ likes: 0, dislikes: 1 });
  });

  it('change emotion to like from dislike', async () => {
    const user = createTestUser();
    const noteId = new mongoose.Types.ObjectId();

    const actualDislike = await service.putEmotion(user, noteId, EmotionType.DISLIKE);
    expect(actualDislike).toStrictEqual({ likes: 0, dislikes: 1 });

    const actualLike = await service.putEmotion(user, noteId, EmotionType.LIKE);
    expect(actualLike).toStrictEqual({ likes: 1, dislikes: 0 });
  });

  it('get emotion counts', async () => {
    const user = createTestUser();
    const noteId = new mongoose.Types.ObjectId();

    await Promise.all([
      service.putEmotion(user, noteId, EmotionType.DISLIKE),
      service.putEmotion(user, noteId, EmotionType.LIKE),
    ]);

    const actual = await service.getEmotionCounts(noteId);
    expect(actual).toStrictEqual({ likes: 1, dislikes: 1 });
  });
});
