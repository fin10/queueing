import { Note } from './note.interface';

export interface NoteResponse {
  readonly note: Note;
  readonly body: string;
}
