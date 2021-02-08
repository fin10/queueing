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

export interface NoteWithBody extends Note {
  readonly body: string;
}

export interface Topic {
  readonly name: string;
  readonly count?: number;
}

export interface ActionFunc {
  (id: string): void;
}

export interface User {
  readonly id: string;
}
