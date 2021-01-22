import { Controller, Param, Post } from '@nestjs/common';
import { ActionService } from './action.service';

@Controller('action')
export class ActionController {
  constructor(private readonly action: ActionService) {}

  @Post('/like/:id')
  async like(@Param('id') id: string): Promise<void> {
    return this.action.like(id);
  }
}
