import { MovieId } from './movie.id';
import { UserId } from './user.id';

export class Movie {
  public readonly createTime: Date = new Date();

  constructor(
    public readonly movieId: MovieId,
    public readonly title: string,
  ) {}
}
