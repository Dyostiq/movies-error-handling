import { Module } from '@nestjs/common';
import { MoviesTestAdaptersModule } from './application/test/movies-test-adapters.module';
import { MoviesApplicationModule } from './application/movies-application.module';
import { MoviesDomainModule } from './domain';
import { MoviesAdaptersModule } from './infrastructure/movies-adapters.module';

@Module({
  imports: [
    MoviesDomainModule,
    MoviesApplicationModule.for([
      MoviesTestAdaptersModule,
      MoviesAdaptersModule,
    ]),
  ],
})
export class MoviesModule {}
