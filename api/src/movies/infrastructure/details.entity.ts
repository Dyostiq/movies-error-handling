import { MovieDetails } from '../application/movie-details';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { MovieId } from '../domain';
import { MovieEntity } from './movie.entity';

@Entity()
export class DetailsEntity implements MovieDetails {
  @PrimaryColumn()
  movieId: string;

  @OneToOne(() => MovieEntity)
  @JoinColumn({ name: 'movieId' })
  movie?: MovieEntity;

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
