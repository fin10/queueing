import { Article } from '@lib/sdk/article/schemas/article.schema';
import { Behavior, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class UpdateArticlePolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Behavior.Update, Article);
  }
}
