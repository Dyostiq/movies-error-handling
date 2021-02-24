import { MovieDetails } from '../application/movie-details';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MovieId } from '../domain';

@Entity()
export class DetailsEntity implements MovieDetails {
  @PrimaryColumn()
  movieId: string;

  @Column()
  title: string;

  @Column()
  released: string;

  @Column()
  genre: string;

  @Column()
  director: string;

  constructor(
    movieId: string,
    title: string,
    released: string,
    genre: string,
    director: string,
  ) {
    this.movieId = movieId;
    this.title = title;
    this.released = released;
    this.genre = genre;
    this.director = director;
  }
}
