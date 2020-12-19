import { Test, TestingModule } from '@nestjs/testing';
import { NoteBodyService } from './note-body.service';

describe('NoteBodyService', () => {
  let service: NoteBodyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteBodyService],
    }).compile();

    service = module.get<NoteBodyService>(NoteBodyService);
  });

  it('should be stored', () => {
    const body = 'test';
    const key = service.put(body);
    const stored = service.get(key);
    expect(stored).toStrictEqual(body);
  });
});
