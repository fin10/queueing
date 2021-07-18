import { Profile } from '@lib/sdk/profile/profile.service';
import mongoose from 'mongoose';
import { NoteDocument } from '../schemas/note.schema';
import { NoteBodyEntity } from '../note-body.entity';

export class Note {
  private constructor(
    private readonly id: mongoose.Types.ObjectId,
    private readonly topic: string | null,
    private readonly title: string | null,
    private readonly body: NoteBodyEntity[] | null,
    private readonly parent: mongoose.Types.ObjectId | null,
    private readonly created: Date,
    private readonly updated: Date,
    private readonly expireTime: Date,
    private readonly children: number,
    private readonly like: number,
    private readonly dislike: number,
    private readonly user: string,
  ) {}

  static instantiate(
    profile: Profile,
    rawNote: NoteDocument,
    children: number,
    like: number,
    dislike: number,
    body?: NoteBodyEntity[],
  ): Note {
    return new Note(
      rawNote._id,
      rawNote.topic || null,
      rawNote.title || null,
      body || null,
      rawNote.parent || null,
      rawNote.get('createdAt'),
      rawNote.get('updatedAt'),
      rawNote.expireTime,
      children,
      like,
      dislike,
      profile.name,
    );
  }
}
