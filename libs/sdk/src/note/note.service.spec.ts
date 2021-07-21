import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import moment from 'moment';
import { User } from '../user/schemas/user.schema';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Note, NoteSchema } from './schemas/note.schema';
import { ConfigService } from '@nestjs/config';

describe('NoteService', () => {
  let mongod: MongoMemoryServer;
  let service: NoteService;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongod.getUri(), { useCreateIndex: true }),
        MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
      ],
      providers: [
        NoteService,
        {
          provide: ConfigService,
          useValue: { get: () => 10 },
        },
      ],
    }).compile();

    service = module.get(NoteService);
  });

  afterEach(async () => {
    if (mongod) await mongod.stop();
  });

  it('create a note', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;

    const id = await service.create(user, 'topic', 'title');

    const created = await service.getNote(id);
    expect(created.userId).toStrictEqual(user._id);
    expect(created.topic).toBe('topic');
    expect(created.title).toBe('title');
  });

  it('update a note', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;

    const id = await service.create(user, 'topic', 'title');
    await service.update(id, 'updatedTopic', 'updatedTitle');

    const updated = await service.getNote(id);
    expect(updated.topic).toBe('updatedTopic');
    expect(updated.title).toBe('updatedTitle');
  });

  it('remove a note', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;

    const id = await service.create(user, 'topic', 'title');
    const created = await service.getNote(id);
    expect(created._id).toStrictEqual(id);

    await service.remove(id);

    const removed = await service.getNote(id);
    expect(removed).toBeNull();
  });

  it('remove expired notes', async () => {
    const user = { _id: new mongoose.Types.ObjectId() } as User;

    const id = await service.create(user, 'topic', 'title');
    const created = await service.getNote(id);
    expect(created._id).toStrictEqual(id);

    const removed = await service.removeExpiredNotes(moment.utc().add(1, 'minute').toDate());
    expect(removed).toBe(1);

    const remainings = await service.getNotes();
    expect(remainings.length).toBe(0);
  });
});
