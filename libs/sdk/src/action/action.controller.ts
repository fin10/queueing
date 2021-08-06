import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { ActionService } from './action.service';
import { EmotionType } from './enums/emotion-type.enum';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { PoliciesGuard } from '../policy/policies.guard';
import { CheckPolicies } from '../policy/decorators/check-policies.decorator';
import { LikeActionPolicyHandler } from '../policy/handlers/like-action-policy.handler';
import { DislikeActionPolicyHandler } from '../policy/handlers/dislike-action-policy.handler';

@UseGuards(UserAuthGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly action: ActionService) {}

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new LikeActionPolicyHandler())
  @Post('/like/:id')
  async like(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const user = req.user as User;
    const emotions = await this.action.putEmotion(user, id, EmotionType.LIKE);
    return { id, ...emotions };
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DislikeActionPolicyHandler())
  @Post('/dislike/:id')
  async dislike(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const user = req.user as User;
    const emotions = await this.action.putEmotion(user, id, EmotionType.DISLIKE);
    return { id, ...emotions };
  }
}
