import { getFixtures } from './get-fixtures';
import { TypeormDetailsRepository } from '../../../src/movies/infrastructure/typeorm-details.repository';
import { MovieId } from '../../../src/movies/domain';
import { right } from 'fp-ts/Either';

const fixtures = getFixtures();

let typeormDetailsRepository: TypeormDetailsRepository;
beforeEach(() => {
  typeormDetailsRepository = fixtures.getTypeormDetailsRepository();
});

test(`with multiple details saved should retrieve the correct one`, async () => {
  // given
  const [firstMovie, secondMovie, thridMovie] = fixtures.sampleDetails();
  // and
  await typeormDetailsRepository.save(new MovieId('first'), firstMovie);
  await typeormDetailsRepository.save(new MovieId('second'), secondMovie);
  await typeormDetailsRepository.save(new MovieId('thrid'), thridMovie);
  // when
  const result = await typeormDetailsRepository.find(new MovieId('second'));
  // then
  expect(result).toStrictEqual(right(secondMovie));
});

test(`should return null if not found`, async () => {
  // given
  // when
  const result = await typeormDetailsRepository.find(
    new MovieId('not existing'),
  );
  // then
  expect(result).toStrictEqual(right(null));
});
