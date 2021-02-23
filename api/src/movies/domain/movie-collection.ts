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
type RollbackMovieError = 'the movie does not exist';
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

  rollbackMovie(title: string): Either<RollbackMovieError, true> {
    if (this.isTitleInCollection(title)) {
      this.removeMovie(title);
      return right(true);
    } else {
      return left('the movie does not exist');
    }
  }

  private isADuplicate(title: string): boolean {
    return this.movies.find((movie) => movie.title === title) !== undefined;
  }

  private addMovie(title: string): Movie {
    const movie = new Movie(MovieId.newOne(), title);
    this.movies.push(movie);
    return movie;
  }

  private isTitleInCollection(title: string): boolean {
    return this.movies.find((movie) => movie.title === title) !== undefined;
  }

  private removeMovie(title: string): void {
    this.movies = this.movies.filter((movie) => movie.title !== title);
  }
}
