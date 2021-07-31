import { Action } from '@lib/sdk/action/schemas/action.schema';
import { Behavior, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class DislikeActionPolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Behavior.Dislike, Action);
  }
}
