import { Comment } from '@lib/sdk/comment/schemas/comment.schema';
import { Action, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class DeleteCommentPolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Delete, Comment);
  }
}
