import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Action } from '../action/schemas/action.schema';
import { Comment } from '../comment/schemas/comment.schema';
import { Note } from '../note/schemas/note.schema';
import { Role } from '../user/enums/role.enum';
import { User } from '../user/schemas/user.schema';

export const enum Behavior {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Like = 'like',
  Dislike = 'dislike',
}

type Subjects = InferSubjects<typeof Note | typeof User | typeof Comment | typeof Action> | 'all';

export type AppAbility = Ability<[Behavior, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): Ability<[Behavior, Subjects]> {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Behavior, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (!user) {
      can(Behavior.Read, 'all');
    } else if (user.roles.includes(Role.Admin)) {
      can(Behavior.Manage, 'all');
    } else {
      can(Behavior.Create, 'all');
      can(Behavior.Read, 'all');
      can(Behavior.Update, Note, { userId: user._id });
      can(Behavior.Delete, Note, { userId: user._id });
      can(Behavior.Delete, Comment, { userId: user._id });
      can(Behavior.Like, Action, 'all');
      can(Behavior.Dislike, Action, 'all');
    }

    if (user?.restriction && moment.utc().isBefore(user.restriction.period)) {
      cannot(Behavior.Create, 'all');
    }

    return build({ detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects> });
  }
}
