import { ArgumentsHost, BadGatewayException, Catch } from '@nestjs/common';
import { ApplicationError, CreateMovieApplicationError } from '../application';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(ApplicationError)
export class ExternalServiceFailedExceptionFilter extends BaseExceptionFilter {
  catch(exception: CreateMovieApplicationError, host: ArgumentsHost) {
    if (exception.message === 'external service failed') {
      return super.catch(new BadGatewayException(), host);
    }
    super.catch(exception, host);
  }
}
