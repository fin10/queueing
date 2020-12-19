import moment from 'moment';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NoteBodyService {
  private readonly bodies: { [key: string]: string } = {};

  put(body: string): string {
    const key = moment().valueOf().toString();
    this.bodies[key] = body;
    return key;
  }

  get(key: string): string {
    const body = this.bodies[key];
    if (!body) throw new NotFoundException(`${key} not found.`);
    return body;
  }
}
