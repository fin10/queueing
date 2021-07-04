import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { NoteService } from '../note/note.service';
import { User } from '../user/schemas/user.schema';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { TopicService } from './topic.service';

describe(TopicService.name, () => {
  let mongod: MongoMemoryServer;
  let service: TopicService;

  const mockNoteService = { count: async () => 0 };

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri(), { useCreateIndex: true }),
        MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
      ],
      providers: [
        TopicService,
        {
          provide: NoteService,
          useValue: mockNoteService,
        },
      ],
    }).compile();

    service = module.get(TopicService);
  });

  afterEach(async () => {
    if (mongod) await mongod.stop();
  });

  it('create topic', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const name = 'test';

    const topic = await service.getOrCreate(user, name);
    expect(topic.userId).toStrictEqual(user._id);
    expect(topic.name).toBe(name);
  });

  it('create duplicate topic', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const name = 'test';

    const actuals = await Promise.all([service.getOrCreate(user, name), service.getOrCreate(user, name)]);

    actuals.forEach((actual) => {
      expect(user._id).toStrictEqual(actual.userId);
      expect(name).toBe(actual.name);
    });
  });

  it('get topics', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const name = 'test';
    await service.getOrCreate(user, name);

    const topics = await service.getTopics();
    expect(topics.length).toBe(1);
  });

  it('get note counts by topics', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const name = 'test';
    const topic = await service.getOrCreate(user, name);

    const spy = jest.spyOn(mockNoteService, 'count').mockResolvedValue(1);

    try {
      const counts = await service.getNoteCountsByTopic([topic]);
      expect(counts[name]).toBe(1);
    } finally {
      spy.mockRestore();
    }
  });

  it('remove empty topics', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;
    const name = 'test';
    await service.getOrCreate(user, name);

    const count = await service.removeEmptyTopics();
    expect(count).toBe(1);
  });
});
