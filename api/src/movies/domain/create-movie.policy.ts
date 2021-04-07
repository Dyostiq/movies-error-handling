import { Movie } from './movie';
import { DomainException } from './domain.exception';

export class CannotCreateAMovie extends DomainException {}

export abstract class CreateMoviePolicy<Errors = CreateMoviePolicyError> {
  abstract canCreate(movies: Movie[], timezone: string): true;
}

export type CreateMoviePolicyError = CannotCreateAMovie;
