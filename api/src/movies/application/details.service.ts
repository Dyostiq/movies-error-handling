import { MovieDetails } from './movie-details';

export abstract class DetailsService {
  abstract fetchDetails(title: string): Promise<MovieDetails>;
}
