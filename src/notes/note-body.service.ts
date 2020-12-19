import moment from 'moment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NoteBodyService {
  private readonly bodies: { [key: string]: string } = {};

  put(body: string): string {
    const key = moment().valueOf().toString();
    this.bodies[key] = body;
    return key;
  }

  get(key: string): string | null {
    return this.bodies[key];
  }
}
