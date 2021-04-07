import { MovieCollection } from '../domain';

export abstract class MovieCollectionRepository {
  abstract findUserMovieCollection(
    userType: 'basic' | 'premium',
    timezone: string,
    userId: string,
  ): Promise<MovieCollection | null>;

  abstract withTransaction<T>(
    transactionCode: (transaction: MovieCollectionRepository) => T,
  ): Promise<T>;

  abstract saveCollection(collection: MovieCollection): Promise<true>;
}
