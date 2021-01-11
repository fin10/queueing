import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from 'src/note/note-body.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from 'src/note/dto/note.dto';
import { NoteModel } from 'src/note/note-model.service';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly topicService: TopicService,
    private readonly noteModel: NoteModel,
    private readonly bodyStore: NoteBodyService,
  ) {}

  async create(data: CreateArticleDto): Promise<string> {
    const { topic, title, body } = data;

    const rawTopic = await this.topicService.getOrCreate(topic);
    const id = await this.noteModel.create(rawTopic.name, title);
    await this.bodyStore.put(id, body);

    return id;
  }

  async getArticle(id: string): Promise<Note> {
    const rawNote = await this.noteModel.getNote(id);
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    const body = await this.bodyStore.get(rawNote._id);
    if (!body) {
      this.noteModel.remove(rawNote._id);
      throw new NotFoundException(`${id} has been expired.`);
    }

    return Note.instantiate(rawNote, body);
  }

  async getArticles(): Promise<Note[]> {
    const rawNotes = await this.noteModel.getNotes({ parent: { $exists: false } });
    return rawNotes.map((rawNote) => Note.instantiate(rawNote));
  }
}
