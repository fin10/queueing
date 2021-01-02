import { RawNote } from 'src/database/schemas/raw-note.schema';

export class Note {
  private constructor(
    private readonly id: string,
    private readonly title: string | null,
    private readonly body: string | null,
    private readonly parent: string | null,
    private readonly created: Date,
    private readonly updated: Date,
    private readonly children: number,
    private readonly like: number,
    private readonly dislike: number,
    private readonly user: string,
  ) {}

  static instantiate(rawNote: RawNote, body?: string): Note {
    return new Note(
      rawNote._id,
      rawNote.title || null,
      body || null,
      rawNote.parent || null,
      rawNote.createdAt,
      rawNote.updatedAt,
      0,
      0,
      0,
      'tmp',
    );
  }
}
