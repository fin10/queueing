export interface Note {
  readonly id: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly children: number;
  readonly like: number;
  readonly dislike: number;
  readonly user: string;
}
