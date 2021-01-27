import { Controller, Param, Post } from '@nestjs/common';
import { ActionService } from './action.service';
import { EmotionType } from './interfaces/emotion-type.interface';

@Controller('action')
export class ActionController {
  constructor(private readonly action: ActionService) {}

  @Post('/like/:id')
  async like(@Param('id') id: string): Promise<void> {
    return this.action.putEmotion(id, EmotionType.LIKE);
  }

  @Post('/dislike/:id')
  async dislike(@Param('id') id: string): Promise<void> {
    return this.action.putEmotion(id, EmotionType.DISLIKE);
  }
}
