import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NoteBodyService } from './note-body.service';
import { NotesService } from './notes.service';
import { RawNote } from './schemas/raw-note.schema';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(RawNote.name),
          useValue: {
            find: jest.fn(() => ({
              lean: () => [],
            })),
          },
        },
        NoteBodyService,
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should get notes', async () => {
    //
  });
});
