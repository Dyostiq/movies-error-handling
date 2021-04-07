import { ArgumentsHost, BadGatewayException, Catch } from '@nestjs/common';
import { ExternalServiceFailed } from '../application';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(ExternalServiceFailed)
export class ExternalServiceFailedExceptionFilter extends BaseExceptionFilter {
  catch(exception: ExternalServiceFailed, host: ArgumentsHost) {
    super.catch(new BadGatewayException(), host);
  }
}
