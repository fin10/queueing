import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES_KEY } from './decorators/check-policies.decorator';
import { PolicyHandler } from './handlers/policy.handler';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly caslAbilityFactory: CaslAbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    const handlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];
    return handlers.every((handler) => this.execPolicyHandler(handler, ability));
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    return handler.handle(ability);
  }
}
