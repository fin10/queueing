import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Topic, TopicSchema } from './schemas/topic.schema';
import { TopicService } from './topic.service';

describe(TopicService.name, () => {
  let mongod: MongoMemoryServer;
  let service: TopicService;

  const mockConfigService = {
    get: (key: string) => {
      if (key === 'QUEUEING_TOPIC_MAX_LENGTH') return 30;
    },
  };

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
      providers: [TopicService, { provide: ConfigService, useValue: mockConfigService }],
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
});
