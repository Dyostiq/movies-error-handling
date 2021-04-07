import {
  ArgumentsHost,
  Catch,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DomainError } from '../domain';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(DomainError)
export class GenericDomainExceptionFilter extends BaseExceptionFilter {
  catch(exception: DomainError<string>, host: ArgumentsHost): void {
    super.catch(new UnprocessableEntityException(exception.message), host);
  }
}
