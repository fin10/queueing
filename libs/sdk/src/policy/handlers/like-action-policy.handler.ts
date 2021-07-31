import { Action } from '@lib/sdk/action/schemas/action.schema';
import { Behavior, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class LikeActionPolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Behavior.Like, Action);
  }
}
