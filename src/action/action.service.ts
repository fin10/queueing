import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteService } from 'src/note/note.service';
import { EmotionType } from './interfaces/emotion-type.interface';
import { RawAction, RawActionDocument } from './schemas/raw-action.schema';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(RawAction.name) private model: Model<RawActionDocument>,
    private readonly noteService: NoteService,
  ) {}

  async putEmotion(id: string, type: EmotionType): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    await this.model.deleteOne({ name: 'emotion', note: note._id });
    await this.model.create({ name: 'emotion', type, note: note._id });
  }

  async getEmotions(id: string, type: EmotionType): Promise<number> {
    return this.model.find({ note: id, name: 'emotion', type }).countDocuments();
  }
}
