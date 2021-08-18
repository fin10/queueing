import { Article } from '@lib/sdk/article/schemas/article.schema';
import { Behavior, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class DeleteArticlePolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Behavior.Delete, Article);
  }
}
