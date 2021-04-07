import { MovieId } from '../domain';
import { MovieDetails } from './movie-details';

export abstract class DetailsRepository {
  abstract save(movieId: MovieId, details: MovieDetails): Promise<MovieId>;
}
