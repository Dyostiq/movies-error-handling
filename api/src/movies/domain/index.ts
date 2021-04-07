export { UserId } from './user.id';
export { MovieId } from './movie.id';
export { Movie } from './movie';
export { MovieCollectionFactory } from './movie-collection.factory';
export { MoviesDomainModule } from './movies-domain.module';
export {
  MovieCollection,
  CreateAMovieError,
  RollbackMovieError,
  MovieCollectionSnapshot,
  DuplicatedMovie,
} from './movie-collection';
export { TooManyMoviesInAMonth } from './basic-user.policy';
export { DomainException } from './domain.exception';
