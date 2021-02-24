import { Module } from '@nestjs/common';
import { MoviesApplicationModule } from './application/movies-application.module';
import { MoviesDomainModule } from './domain';
import { MoviesAdaptersModule } from './infrastructure/movies-adapters.module';

@Module({
  imports: [
    MoviesDomainModule,
    MoviesApplicationModule.for([MoviesAdaptersModule]),
  ],
})
export class MoviesModule {}
