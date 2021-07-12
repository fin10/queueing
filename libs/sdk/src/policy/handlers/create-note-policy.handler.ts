import { RawNote } from '@lib/sdk/note/schemas/raw-note.schema';
import { Action, AppAbility } from '../casl-ability.factory';
import { PolicyHandler } from './policy.handler';

export class CreateNotePolicyHandler implements PolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Create, RawNote);
  }
}
