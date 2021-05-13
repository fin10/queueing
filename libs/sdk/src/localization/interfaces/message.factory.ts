import { Restriction } from '@lib/sdk/user/restriction';

export interface MessageFactory {
  restriction(restriction: Restriction): string;
}
