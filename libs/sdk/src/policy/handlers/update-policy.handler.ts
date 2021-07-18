import { Note } from '@lib/sdk/note/schemas/note.schema';
import { Action, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class UpdateNotePolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Update, Note);
  }
}
