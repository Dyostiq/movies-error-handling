import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Headers,
  UnprocessableEntityException,
  BadGatewayException,
} from '@nestjs/common';
import { isLeft } from 'fp-ts/Either';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateMovieService, GetMoviesService } from '../application';
import { CreateMovieDto } from './create-movie.dto';
import { MoviesCollectionDto } from './movies-collection.dto';
import { ApiHeaders } from '@nestjs/swagger';

@Controller('/movies')
export class MovieController {
  constructor(
    private readonly createMovieService: CreateMovieService,
    private readonly getMoviesService: GetMoviesService,
  ) {}

  @Post()
  @ApiHeaders([{ name: 'role', enum: ['basic', 'premium'] }])
  async createAMovie(
    @Req() request: Request,
    @Body() body: CreateMovieDto,
    @Headers('userId') userId: string,
    @Headers('role') role: 'basic' | 'premium',
  ): Promise<void> {
    const result = await this.createMovieService.createMovie(
      body.title,
      userId.toString(),
      role,
    );
    if (isLeft(result)) {
      switch (result.left) {
        case 'duplicate':
        case 'too many movies in a month':
          throw new UnprocessableEntityException(result.left);
        case 'service unavailable':
        case 'cannot create a movie':
          throw new InternalServerErrorException();
        case 'external service failed':
          throw new BadGatewayException();
      }
    }
  }

  @Get()
  async listMovies(
    @Req() request: Request,
    @Headers('userId') userId: string,
  ): Promise<MoviesCollectionDto> {
    const result = await this.getMoviesService.getMovies(userId.toString());
    if (isLeft(result)) {
      switch (result.left) {
        case 'error':
          throw new InternalServerErrorException();
      }
    }
    return plainToClass(MoviesCollectionDto, {
      items: result.right,
    });
  }
}
