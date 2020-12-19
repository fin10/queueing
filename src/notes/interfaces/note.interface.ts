export interface Note {
  readonly id: string;
  readonly title: string;
  readonly body?: string;
  readonly created: Date;
  readonly updated: Date;
}
