import { Either, isLeft, left, right } from 'fp-ts/Either';
import { Movie } from './movie';
import {
  CreateMoviePolicy,
  CreateMoviePolicyError,
} from './create-movie.policy';
import { UserId } from './user.id';
import { MovieId } from './movie.id';
import { BasicUserPolicyError } from './basic-user.policy';

type AllCreateMoviePolicyError = BasicUserPolicyError | CreateMoviePolicyError;
type CreateAMovieError = 'duplicate' | AllCreateMoviePolicyError;
export class MovieCollection {
  private movies: Movie[] = [];

  constructor(
    private readonly policy: CreateMoviePolicy<AllCreateMoviePolicyError>,
    private readonly userId: UserId,
    private readonly timezone: string,
  ) {}

  createMovie(title: string): Either<CreateAMovieError, MovieId> {
    if (this.isADuplicate(title)) {
      return left('duplicate');
    }
    const result = this.policy.canCreate(this.movies, this.timezone);
    if (isLeft(result)) {
      return result;
    }

    return right(this.addMovie(title).movieId);
  }

  listMovies(): string[] {
    return this.movies.map((movie) => movie.title);
  }

  private isADuplicate(title: string): boolean {
    return this.movies.find((movie) => movie.title === title) !== undefined;
  }

  private addMovie(title: string): Movie {
    const movie = new Movie(MovieId.newOne(), title);
    this.movies.push(movie);
    return movie;
  }
}
