import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../handlers/policy.handler';

export const CHECK_POLICIES_KEY = 'check_policy';

export const CheckPolicies = (...handlers: PolicyHandler[]): CustomDecorator<string> =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);