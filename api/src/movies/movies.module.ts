import { Module } from '@nestjs/common';
import { MoviesDomainModule } from './domain';

@Module({
  imports: [MoviesDomainModule],
})
export class MoviesModule {}
