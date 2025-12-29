import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc.types';

@Catch()
export class RpcAllExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof RpcException) {
      const error = exception.getError();

      if (error['statusCode'] === 400) {
        const payload: RpcErrorPayload = {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: exception.message, // Or extract relevant details from the exception
        };
        return super.catch(new RpcException(payload), host);
      }
    }

    const payload: RpcErrorPayload = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    };
    return super.catch(new RpcException(payload), host);
  }
}
