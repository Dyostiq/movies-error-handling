import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { clearRepo } from '../../clear-repo';
import { TypeormDetailsRepository } from '../../../src/movies/infrastructure/typeorm-details.repository';
import { MovieDetails } from '../../../src/movies/application/movie-details';
import { MovieCollectionRepository } from '../../../src/movies/application';
import { TypeormMovieCollectionRepository } from '../../../src/movies/infrastructure/typeorm-movie-collection.repository';
import { DetailsRepository } from '../../../src/movies/application/details.repository';

export function getFixtures() {
  const fixtures: {
    getTypeormDetailsRepository: () => TypeormDetailsRepository;
    sampleDetails: () => [MovieDetails, MovieDetails, MovieDetails];
  } = {
    getTypeormDetailsRepository: () => {
      throw new Error();
    },
    sampleDetails: () => [
      new MovieDetails(
        'Batman',
        '23 Jun 1989',
        'Action, Adventure',
        'Tim Burton',
      ),
      new MovieDetails(
        'Batman Returns',
        '19 Jun 1992',
        'Action, Crime, Fantasy',
        'Tim Burton',
      ),
      new MovieDetails(
        'Batman Forever',
        '16 Jun 1995',
        'Action, Adventure',
        'Joel Schumacher',
      ),
    ],
  };

  let moduleFixture: TestingModule;
  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await clearRepo(moduleFixture);

    fixtures.getTypeormDetailsRepository = () => {
      const repo = moduleFixture.get(DetailsRepository);
      if (!(repo instanceof TypeormDetailsRepository)) {
        fail();
      }
      return repo;
    };
    await moduleFixture.init();
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  return fixtures;
}
