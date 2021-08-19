export enum EntityType {
  STRING = 'string',
  IMAGE = 'image',
  VIDEO = 'video',
  YOUTUBE = 'youtube',
  LINK = 'link',
}

export class ContentsEntity {
  private constructor(readonly type: EntityType, readonly value: string) {}

  static string(value: string): ContentsEntity {
    return new ContentsEntity(EntityType.STRING, value);
  }

  static image(value: string): ContentsEntity {
    return new ContentsEntity(EntityType.IMAGE, value);
  }

  static video(value: string): ContentsEntity {
    return new ContentsEntity(EntityType.VIDEO, value);
  }

  static youtube(value: string): ContentsEntity {
    return new ContentsEntity(EntityType.YOUTUBE, value);
  }

  static link(value: string): ContentsEntity {
    return new ContentsEntity(EntityType.LINK, value);
  }
}
