import { Movie } from './movie';
import { DomainEither } from './domain.either';

export abstract class CreateMoviePolicy<
  Errors extends string = CreateMoviePolicyError
> {
  abstract canCreate(
    movies: Movie[],
    timezone: string,
  ): DomainEither<Errors, true>;
}

export type CreateMoviePolicyError = 'cannot create a movie';
