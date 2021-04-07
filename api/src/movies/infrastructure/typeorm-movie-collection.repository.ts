import { MovieCollectionRepository } from '../application';
import { MovieCollection, MovieCollectionFactory, UserId } from '../domain';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { MovieCollectionEntity } from './movie-collection.entity';
import { MovieEntity } from './movie.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeormMovieCollectionRepository extends MovieCollectionRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly movieCollectionFactory: MovieCollectionFactory,
  ) {
    super();
  }

  async findUserMovieCollection(
    userType: 'basic' | 'premium',
    timezone: string,
    userId: string,
  ): Promise<MovieCollection | null> {
    const snapshot = await this.entityManager.findOne(
      MovieCollectionEntity,
      userId,
    );

    if (!snapshot) {
      return null;
    }

    return this.movieCollectionFactory.createMovieCollection(
      userType,
      timezone,
      new UserId(userId),
      snapshot,
    );
  }

  async saveCollection(collection: MovieCollection): Promise<true> {
    const snapshot = collection.toSnapshot();
    const snapshotEntity = new MovieCollectionEntity(
      snapshot.movies.map((movie) =>
        MovieEntity.fromMovie(movie, snapshot.userId.id),
      ),
      snapshot.timezone,
      snapshot.userId.id,
    );
    await this.entityManager.save(snapshotEntity);
    return true;
  }

  async withTransaction<T>(
    transactionCode: (transaction: MovieCollectionRepository) => T,
  ): Promise<T> {
    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const repositoryCopy = new TypeormMovieCollectionRepository(
          transactionalEntityManager,
          this.movieCollectionFactory,
        );
        return await transactionCode(repositoryCopy);
      },
    );
  }
}
