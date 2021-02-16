import { Note } from '@lib/sdk/note/dto/note.dto';

export interface ArticlesResponse {
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly notes: Note[];
}
