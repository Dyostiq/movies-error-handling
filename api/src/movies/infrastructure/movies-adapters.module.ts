import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieCollectionEntity } from './movie-collection.entity';
import { MovieEntity } from './movie.entity';
import { MovieCollectionRepository } from '../application';
import { TypeormMovieCollectionRepository } from './typeorm-movie-collection.repository';
import { MoviesDomainModule } from '../domain';
import { DetailsEntity } from './details.entity';
import { DetailsRepository } from '../application/details.repository';
import { TypeormDetailsRepository } from './typeorm-details.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieCollectionEntity,
      MovieEntity,
      DetailsEntity,
    ]),
    MoviesDomainModule,
  ],
  providers: [
    {
      provide: MovieCollectionRepository,
      useClass: TypeormMovieCollectionRepository,
    },
    {
      provide: DetailsRepository,
      useClass: TypeormDetailsRepository,
    },
  ],
  exports: [MovieCollectionRepository, DetailsRepository],
})
export class MoviesAdaptersModule {}
