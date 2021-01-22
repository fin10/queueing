import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteService } from 'src/note/note.service';
import { RawAction, RawActionDocument } from './schemas/raw-action.schema';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(RawAction.name) private model: Model<RawActionDocument>,
    private readonly noteService: NoteService,
  ) {}

  async like(id: string): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    await this.model.deleteOne({ name: 'emotion', note: note._id });
    await this.model.create({ name: 'emotion', type: 'like', note: note._id });
  }

  async getLikes(id: string): Promise<number> {
    return this.model.find({ note: id, name: 'emotion', type: 'like' }).countDocuments();
  }
}
