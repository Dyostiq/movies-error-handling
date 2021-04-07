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
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import {
  CreateMovieService,
  GetMoviesService,
  ExternalServiceFailed,
} from '../application';
import { CreateMovieDto } from './create-movie.dto';
import { MoviesCollectionDto } from './movies-collection.dto';
import { ApiHeaders } from '@nestjs/swagger';
import { DomainException } from '../domain';

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
    try {
      await this.createMovieService.createMovie(
        body.title,
        userId.toString(),
        role,
      );
    } catch (error) {
      if (error instanceof DomainException) {
        throw new UnprocessableEntityException(error.message);
      }
      switch (error.constructor) {
        case ExternalServiceFailed:
          throw new BadGatewayException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  @Get()
  async listMovies(
    @Req() request: Request,
    @Headers('userId') userId: string,
  ): Promise<MoviesCollectionDto> {
    const result = await this.getMoviesService.getMovies(userId.toString());

    return plainToClass(MoviesCollectionDto, {
      items: result,
    });
  }
}
