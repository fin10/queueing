export enum EntityType {
  STRING = 'string',
  IMAGE = 'image',
  VIDEO = 'video',
  YOUTUBE = 'youtube',
  LINK = 'link',
}

export class NoteBodyEntity {
  private constructor(readonly type: EntityType, readonly value: string) {}

  static string(value: string): NoteBodyEntity {
    return new NoteBodyEntity(EntityType.STRING, value);
  }

  static image(value: string): NoteBodyEntity {
    return new NoteBodyEntity(EntityType.IMAGE, value);
  }

  static video(value: string): NoteBodyEntity {
    return new NoteBodyEntity(EntityType.VIDEO, value);
  }

  static youtube(value: string): NoteBodyEntity {
    return new NoteBodyEntity(EntityType.YOUTUBE, value);
  }

  static link(value: string): NoteBodyEntity {
    return new NoteBodyEntity(EntityType.LINK, value);
  }
}
