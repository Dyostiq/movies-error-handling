import { MovieCollectionRepository } from '..';
import { Optional } from 'utility-types';
import {
  MovieCollection,
  MovieCollectionFactory,
  MovieCollectionSnapshot,
  UserId,
} from '../../domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryCollectionRepository extends MovieCollectionRepository {
  db: Optional<{
    [id: string]: MovieCollectionSnapshot;
  }> = {};

  constructor(private readonly movieCollectionFactory: MovieCollectionFactory) {
    super();
  }

  async findUserMovieCollection(
    userType: 'basic' | 'premium',
    timezone: string,
    userId: string,
  ): Promise<MovieCollection | null> {
    const movieCollectionSnapshot = this.db[userId];
    if (!movieCollectionSnapshot) {
      return null;
    }
    return this.movieCollectionFactory.createMovieCollection(
      userType,
      timezone,
      new UserId(userId),
      movieCollectionSnapshot,
    );
  }

  async saveCollection(collection: MovieCollection): Promise<true> {
    const snapshot = collection.toSnapshot();
    this.db[snapshot.userId.id] = snapshot;
    return true;
  }

  async withTransaction<T>(
    transactionCode: (transaction: MovieCollectionRepository) => T,
  ): Promise<T> {
    return transactionCode(this);
  }
}
