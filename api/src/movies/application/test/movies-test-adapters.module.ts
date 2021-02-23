import { Module } from '@nestjs/common';
import { MoviesDomainModule } from '../../domain';
import { CollectionRepository } from '../collection.repository';
import { InMemoryCollectionRepository } from './in-memory-collection.repository';
import { DetailsRepository } from '../details.repository';
import { InMemoryDetailsRepository } from './in-memory-details.repository';
import { DetailsService } from '../details.service';
import { InMemoryDetailsService } from './in-memory-details.service';

@Module({
  imports: [MoviesDomainModule],
  providers: [
    {
      provide: CollectionRepository,
      useClass: InMemoryCollectionRepository,
    },
    {
      provide: DetailsRepository,
      useClass: InMemoryDetailsRepository,
    },
    {
      provide: DetailsService,
      useClass: InMemoryDetailsService,
    },
  ],
  exports: [CollectionRepository, DetailsRepository, DetailsService],
})
export class MoviesTestAdaptersModule {}
