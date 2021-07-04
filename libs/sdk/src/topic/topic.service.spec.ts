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

  const createTestUser = () => {
    return { _id: new mongoose.Types.ObjectId() } as User;
  };

  const createTestTopic = (name = 'test') => {
    return service.getOrCreate(createTestUser(), name);
  };

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
    const user = createTestUser();

    const topic = await service.getOrCreate(user, 'test');

    expect(topic.userId).toStrictEqual(user._id);
    expect(topic.name).toBe('test');
  });

  it('create duplicate topic', async () => {
    const user = createTestUser();

    const actuals = await Promise.all([
      service.getOrCreate(user, 'test'),
      service.getOrCreate(user, 'test'),
      service.getOrCreate(user, 'test'),
    ]);

    actuals.forEach((actual) => {
      expect(user._id).toStrictEqual(actual.userId);
      expect('test').toBe(actual.name);
    });
  });

  it('get topics', async () => {
    const topic = await createTestTopic();

    const topics = await service.getTopics();
    expect(topics.length).toBe(1);
    expect(topics[0].userId).toStrictEqual(topic.userId);
    expect(topics[0].name).toBe(topic.name);
  });

  it('get note counts by topics', async () => {
    const topic = await createTestTopic();

    jest.spyOn(mockNoteService, 'count').mockResolvedValueOnce(1);

    const counts = await service.getNoteCountsByTopic([topic]);
    expect(counts[topic.name]).toBe(1);
  });

  it('remove empty topics', async () => {
    await createTestTopic();

    const count = await service.removeEmptyTopics();
    expect(count).toBe(1);
  });
});
