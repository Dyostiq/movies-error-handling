import { MovieDetails } from './movie-details';
import { ApplicationException } from './application.exception';

export class GetMoviesUnknownError extends ApplicationException {}
export type GetMoviesError = GetMoviesUnknownError;

export abstract class GetMoviesService {
  abstract getMovies(userId: string): Promise<MovieDetails[]>;
}
