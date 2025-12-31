import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc.types';

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger('RpcAllExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error('=== Caught Exception ===', exception);

    if (exception instanceof RpcException) {
      const error = exception.getError();

      if (error['statusCode'] === 400) {
        const payload: RpcErrorPayload = {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: exception.message,
        };
        return super.catch(new RpcException(payload), host);
      }
    }

    // Handle Mongoose validation errors
    if (exception instanceof Error && exception.name === 'ValidationError') {
      const payload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: exception.message || 'Validation failed',
        details: (exception as any).errors,
      };
      return super.catch(new RpcException(payload), host);
    }

    const message =
      exception instanceof Error
        ? exception.message
        : 'An unexpected error occurred';

    const payload: RpcErrorPayload = {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    };
    return super.catch(new RpcException(payload), host);
  }
}
