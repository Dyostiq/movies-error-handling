import * as luxon from 'luxon';
import { Injectable } from '@nestjs/common';
import { left, right } from 'fp-ts/Either';
import { CreateMoviePolicy } from './create-movie.policy';
import { Movie } from './movie';
import { DomainEither } from './domain.either';
import { DomainError } from './domain.error';

export type BasicUserPolicyError = 'too many movies in a month';

@Injectable()
export class BasicUserPolicy extends CreateMoviePolicy<BasicUserPolicyError> {
  canCreate(
    movies: Movie[],
    timezone: string,
  ): DomainEither<BasicUserPolicyError, true> {
    if (this.numberOfMoviesThisMonth(movies, timezone) >= 5) {
      return left(new DomainError('too many movies in a month'));
    }
    return right(true);
  }

  private numberOfMoviesThisMonth(movies: Movie[], timezone: string) {
    return movies.reduce((numberOfMoviesThisMonth, movie) => {
      const isInCurrentMonth = luxon.DateTime.now()
        .setZone(timezone)
        .hasSame(luxon.DateTime.fromJSDate(movie.createTime), 'month');

      if (isInCurrentMonth) {
        return numberOfMoviesThisMonth + 1;
      } else {
        return numberOfMoviesThisMonth;
      }
    }, 0);
  }
}
