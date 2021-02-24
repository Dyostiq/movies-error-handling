import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';
import { TypeormMovieCollectionRepository } from '../../../src/movies/infrastructure/typeorm-movie-collection.repository';
import { MovieCollectionFactory } from '../../../src/movies/domain';

export function getFixtures() {
  const fixtures: {
    getTypeormMovieCollectionRepository: () => TypeormMovieCollectionRepository;
    getMovieCollectionFactory: () => MovieCollectionFactory;
  } = {
    getTypeormMovieCollectionRepository: () => {
      throw new Error();
    },
    getMovieCollectionFactory: () => {
      throw new Error();
    },
  };

  let moduleFixture: TestingModule;
  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const connection = moduleFixture.get<Connection>(getConnectionToken());
    await connection.query(
      `
          TRUNCATE ${connection.entityMetadatas
            .map((metadata) => `"${metadata.tableName}"`)
            .join(',')} CASCADE
        `,
    );

    fixtures.getTypeormMovieCollectionRepository = () =>
      moduleFixture.get(TypeormMovieCollectionRepository);
    fixtures.getMovieCollectionFactory = () =>
      moduleFixture.get(MovieCollectionFactory);
    await moduleFixture.init();
  });

  afterEach(async () => {
    await moduleFixture.close();
  });

  return fixtures;
}
