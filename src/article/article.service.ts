import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from 'src/note/note-body.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from 'src/note/dto/note.dto';
import { NoteService } from 'src/note/note.service';
import { TopicService } from 'src/topic/topic.service';
import { RawNote } from 'src/note/schemas/raw-note.schema';
import { ActionService } from 'src/action/action.service';
import { EmotionType } from 'src/action/interfaces/emotion-type.interface';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly topicService: TopicService,
    private readonly noteService: NoteService,
    private readonly actionService: ActionService,
    private readonly bodyStore: NoteBodyService,
  ) {}

  async create(user: User, data: CreateArticleDto): Promise<string> {
    const { topic, title, body } = data;

    const rawTopic = await this.topicService.getOrCreate(user, topic);
    const id = await this.noteService.create(user, rawTopic.name, title);
    await this.bodyStore.put(id, body);

    return id;
  }

  async update(user: User, id: string, data: CreateArticleDto): Promise<string> {
    const { topic, title, body } = data;

    const rawTopic = await this.topicService.getOrCreate(user, topic);
    await this.noteService.update(id, rawTopic.name, title);
    await this.bodyStore.remove(id);
    await this.bodyStore.put(id, body);

    return id;
  }

  async remove(id: string): Promise<void> {
    return this.noteService.remove(id);
  }

  async getArticle(id: string): Promise<Note> {
    const rawNote = await this.noteService.getNote(id);
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    const body = await this.bodyStore.get(rawNote._id);
    if (!body) {
      this.noteService.remove(rawNote._id);
      throw new NotFoundException(`${id} has been expired.`);
    }

    return this.populate(rawNote, body);
  }

  async getArticles(): Promise<Note[]> {
    const rawNotes = await this.noteService.getNotes({ parent: { $exists: false } }, '-createdAt');
    return Promise.all(rawNotes.map((rawNote) => this.populate(rawNote)));
  }

  private async populate(rawNote: RawNote, body?: string): Promise<Note> {
    const comments = await this.noteService.count({ parent: rawNote._id });
    const like = await this.actionService.getEmotions(rawNote._id, EmotionType.LIKE);
    const dislike = await this.actionService.getEmotions(rawNote._id, EmotionType.DISLIKE);

    return Note.instantiate({ ...rawNote }, comments, like, dislike, body);
  }
}
