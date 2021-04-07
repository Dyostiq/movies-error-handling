import { MovieCollectionRepository } from './movie-collection.repository';
import {
  CreateAMovieError,
  MovieCollection,
  MovieCollectionFactory,
  MovieId,
  UserId,
} from '../domain';
import { DetailsRepository } from './details.repository';
import { DetailsService } from './details.service';
import { Injectable } from '@nestjs/common';
import { ApplicationException } from './application.exception';
import { MovieDetails } from './movie-details';

export class ExternalServiceFailed extends ApplicationException {}
export class ServiceUnavailable extends ApplicationException {}

export type CreateMovieApplicationError =
  | ExternalServiceFailed
  | ServiceUnavailable
  | CreateAMovieError;

@Injectable()
export class CreateMovieService {
  constructor(
    private readonly collections: MovieCollectionRepository,
    private readonly collectionFactory: MovieCollectionFactory,
    private readonly detailsRepository: DetailsRepository,
    private readonly detailsService: DetailsService,
  ) {}

  async createMovie(
    title: string,
    userId: string,
    userRole: 'basic' | 'premium',
  ): Promise<MovieId> {
    const timezone = 'UTC';

    const createMovieResult = await this.createMovieInTransaction(
      userRole,
      timezone,
      userId,
      title,
    );

    let fetchedDetails: MovieDetails;
    try {
      fetchedDetails = await this.detailsService.fetchDetails(title);
    } catch (error) {
      await this.rollbackMovieInTransaction(userRole, timezone, userId, title);
      throw new ExternalServiceFailed();
    }

    try {
      await this.detailsRepository.save(createMovieResult, fetchedDetails);
    } catch (error) {
      await this.rollbackMovieInTransaction(userRole, timezone, userId, title);
      throw new ExternalServiceFailed();
    }

    return createMovieResult;
  }

  private async createMovieInTransaction(
    userRole: 'basic' | 'premium',
    timezone: string,
    userId: string,
    title: string,
  ) {
    return await this.collections.withTransaction(
      async (transactionalCollections) => {
        let findResult: MovieCollection | null;
        try {
          findResult = await transactionalCollections.findUserMovieCollection(
            userRole,
            timezone,
            userId,
          );
        } catch (error) {
          throw new ServiceUnavailable();
        }

        const collection =
          findResult ??
          this.collectionFactory.createMovieCollection(
            userRole,
            'UTC',
            new UserId(userId),
          );

        const movieCreationResult = collection.createMovie(title);

        try {
          await transactionalCollections.saveCollection(collection);
        } catch (error) {
          throw new ServiceUnavailable();
        }
        return movieCreationResult;
      },
    );
  }

  private async rollbackMovieInTransaction(
    userRole: 'basic' | 'premium',
    timezone: string,
    userId: string,
    title: string,
  ): Promise<void> {
    await this.collections.withTransaction(async (transactionalCollections) => {
      const collection = await transactionalCollections.findUserMovieCollection(
        userRole,
        timezone,
        userId,
      );
      if (!collection) {
        return;
      }
      await collection.rollbackMovie(title);
      await transactionalCollections.saveCollection(collection);
    });
  }
}
