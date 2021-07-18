import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Note } from '../note/schemas/note.schema';
import { Role } from '../user/enums/role.enum';
import { User } from '../user/schemas/user.schema';

export const enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Note | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): Ability<[Action, Subjects]> {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    if (!user) {
      can(Action.Read, 'all');
    } else if (user.roles.includes(Role.Admin)) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Create, 'all');
      can(Action.Read, 'all');
      can(Action.Update, Note, { userId: user._id });
      can(Action.Delete, Note, { userId: user._id });
    }

    if (user?.restriction && moment.utc().isBefore(user.restriction.period)) {
      cannot(Action.Create, 'all');
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
