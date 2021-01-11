export interface Note {
  readonly id: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
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
}
