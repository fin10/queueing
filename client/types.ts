export interface Note {
  readonly id: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly like: number;
  readonly dislike: number;
  readonly user: string;
}

export enum EntityType {
  STRING = 'string',
  IMAGE = 'image',
  VIDEO = 'video',
  YOUTUBE = 'youtube',
  LINK = 'link',
}

export interface NoteBodyEntity {
  readonly type: EntityType;
  readonly value: string;
}

export interface NoteWithBody extends Note {
  readonly body: NoteBodyEntity[];
}

export interface ArticlesResponse {
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly notes: Note[];
}

export interface Topic {
  readonly name: string;
  readonly count?: number;
}

export interface ActionFunc {
  (id: string): void;
}

export interface Profile {
  readonly name: string;
}
