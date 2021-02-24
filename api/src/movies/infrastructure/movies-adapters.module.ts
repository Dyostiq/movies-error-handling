import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieCollectionEntity } from './movie-collection.entity';
import { MovieEntity } from './movie.entity';
import { MovieCollectionRepository } from '../application';
import { TypeormMovieCollectionRepository } from './typeorm-movie-collection.repository';
import { MoviesDomainModule } from '../domain';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieCollectionEntity, MovieEntity]),
    MoviesDomainModule,
  ],
  providers: [
    {
      provide: MovieCollectionRepository,
      useClass: TypeormMovieCollectionRepository,
    },
  ],
  exports: [MovieCollectionRepository],
})
export class MoviesAdaptersModule {}
