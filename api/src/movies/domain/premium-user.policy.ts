import {
  CreateMoviePolicy,
  CreateMoviePolicyError,
} from './create-movie.policy';
import { right } from 'fp-ts/Either';
import { Injectable } from '@nestjs/common';
import { DomainEither } from './domain.either';

@Injectable()
export class PremiumUserPolicy extends CreateMoviePolicy {
  canCreate(): DomainEither<CreateMoviePolicyError, true> {
    return right(true);
  }
}
