import { Injectable } from '@nestjs/common';
import { DetailsRepository, MovieDetails } from '../application';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieId } from '../domain';
import { DetailsEntity } from './details.entity';

@Injectable()
export class TypeormDetailsRepository extends DetailsRepository {
  constructor(
    @InjectRepository(DetailsEntity)
    private readonly details: Repository<DetailsEntity>,
  ) {
    super();
  }

  async save(movieId: MovieId, details: MovieDetails): Promise<MovieId> {
    await this.details.save(
      new DetailsEntity(
        movieId.id,
        details.title,
        details.released,
        details.genre,
        details.director,
      ),
    );
    return movieId;
  }

  async find(movieId: MovieId): Promise<MovieDetails | null> {
    const entity = await this.details.findOne(movieId.id);
    if (!entity) {
      return null;
    }

    return new MovieDetails(
      entity.title,
      entity.released,
      entity.genre,
      entity.director,
    );
  }
}
