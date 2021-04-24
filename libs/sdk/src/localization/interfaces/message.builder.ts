import { Restriction } from '@lib/sdk/user/restriction';

export interface MessageBuilder {
  restriction(restriction: Restriction): string;
}
