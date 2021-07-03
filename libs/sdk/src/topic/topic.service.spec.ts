import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { NoteService } from '../note/note.service';
import { User } from '../user/schemas/user.schema';
import { RawTopic, RawTopicSchema } from './schemas/topic.schema';
import { TopicService } from './topic.service';

describe(TopicService.name, () => {
  let mongod: MongoMemoryServer;
  let service: TopicService;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri(), { useCreateIndex: true }),
        MongooseModule.forFeature([{ name: RawTopic.name, schema: RawTopicSchema }]),
      ],
      providers: [
        TopicService,
        {
          provide: NoteService,
          useValue: { count: async () => 0 },
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
});
