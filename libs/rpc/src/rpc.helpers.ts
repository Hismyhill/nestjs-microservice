import { RpcException } from '@nestjs/microservices';
import { RpcErrorPayload } from './rpc.types';

export function rpcBadRequest(message: string, details?: any): never {
  const payload: RpcErrorPayload = {
    code: 'INVALID_REQUEST',
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcNotFound(message: string, details?: any): never {
  const payload: RpcErrorPayload = {
    code: 'NOT_FOUND',
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcInternal(message: string, details?: any): never {
  const payload: RpcErrorPayload = {
    code: 'INTERNAL_SERVER_ERROR',
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcUnauthorized(message: string, details?: any): never {
  const payload: RpcErrorPayload = {
    code: 'UNAUTHORIZED',
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcForbidden(message: string, details?: any): never {
  const payload: RpcErrorPayload = {
    code: 'FORBIDDEN',
    message,
    details,
  };
  throw new RpcException(payload);
}

export function rpcValidationError(message: string, details?: any): never {
  const payload: RpcErrorPayload = {
    code: 'VALIDATION_ERROR',
    message,
    details,
  };
  throw new RpcException(payload);
}
