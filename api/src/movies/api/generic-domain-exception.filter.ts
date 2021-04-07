import {
  ArgumentsHost,
  Catch,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DomainException } from '../domain';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(DomainException)
export class GenericDomainExceptionFilter extends BaseExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    super.catch(new UnprocessableEntityException(exception.message), host);
  }
}
