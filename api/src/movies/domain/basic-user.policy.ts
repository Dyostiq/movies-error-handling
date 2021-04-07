import * as luxon from 'luxon';
import { Injectable } from '@nestjs/common';
import { CreateMoviePolicy } from './create-movie.policy';
import { Movie } from './movie';
import { DomainException } from './domain.exception';

export class TooManyMoviesInAMonth extends DomainException {
  constructor() {
    super('too many movies in a month');
  }
}
export type BasicUserPolicyError = TooManyMoviesInAMonth;

@Injectable()
export class BasicUserPolicy extends CreateMoviePolicy<BasicUserPolicyError> {
  canCreate(movies: Movie[], timezone: string): true {
    if (this.numberOfMoviesThisMonth(movies, timezone) >= 5) {
      throw new TooManyMoviesInAMonth();
    }
    return true;
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
