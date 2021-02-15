export class NoteRemovedEvent {
  constructor(private readonly id: string) {}

  getId(): string {
    return this.id;
  }
}
