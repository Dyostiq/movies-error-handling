import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import {
  CreateMovieService,
  ExternalServiceFailed,
  GetMoviesService,
} from '../application';
import { CreateMovieDto } from './create-movie.dto';
import { MoviesCollectionDto } from './movies-collection.dto';
import { ApiHeaders } from '@nestjs/swagger';
import { GenericDomainExceptionFilter } from './generic-domain-exception.filter';
import { ExternalServiceFailedExceptionFilter } from './external-service-failed-exception.filter';

@Controller('/movies')
export class MovieController {
  constructor(
    private readonly createMovieService: CreateMovieService,
    private readonly getMoviesService: GetMoviesService,
  ) {}

  @Post()
  @ApiHeaders([{ name: 'role', enum: ['basic', 'premium'] }])
  @UseFilters(
    GenericDomainExceptionFilter,
    ExternalServiceFailedExceptionFilter,
  )
  async createAMovie(
    @Req() request: Request,
    @Body() body: CreateMovieDto,
    @Headers('userId') userId: string,
    @Headers('role') role: 'basic' | 'premium',
  ): Promise<void> {
    await this.createMovieService.createMovie(
      body.title,
      userId.toString(),
      role,
    );
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
