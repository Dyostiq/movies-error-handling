import { BasicUserPolicy } from './basic-user.policy';
import { PremiumUserPolicy } from './premium-user.policy';
import { MovieCollection } from './movie-collection';
import { UserId } from './user.id';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieCollectionFactory {
  #policies = {
    basic: this.basicUserPolicy,
    premium: this.premiumUserPolicy,
  };

  constructor(
    private readonly basicUserPolicy: BasicUserPolicy,
    private readonly premiumUserPolicy: PremiumUserPolicy,
  ) {}

  createMovieCollectionFor(
    userType: 'basic' | 'premium',
    timezone: string,
    userId: UserId,
  ): MovieCollection {
    return new MovieCollection(this.#policies[userType], userId, timezone);
  }
}
