import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const logger = new Logger('RpcErrorMapper');

export function mapRpcErrorToHttp(err: any): never {
  console.error('=== Raw RPC Error ===');
  console.error(JSON.stringify(err, null, 2));
  logger.error('Raw RPC Error:', err);

  // Handle different error structures from RMQ
  let payload = err;

  // If error is wrapped in .error property
  if (err?.error) {
    payload = err.error;
  }

  // If error is an RpcException with error property
  if (payload?.error && typeof payload.error === 'object') {
    payload = payload.error;
  }

  const code = payload?.code as string | undefined;
  const message = payload?.message ?? err?.message ?? 'Request failed';

  console.error(`Code: ${code}, Message: ${message}`);

  if (code === 'VALIDATION_ERROR' || code === 'BAD_REQUEST') {
    throw new BadRequestException(message);
  }

  if (code === 'NOT_FOUND') {
    throw new NotFoundException(message);
  }

  if (code === 'UNAUTHORIZED') {
    throw new UnauthorizedException(message);
  }

  if (code === 'FORBIDDEN') {
    throw new ForbiddenException(message);
  }

  if (code === 'INTERNAL_SERVER_ERROR') {
    throw new InternalServerErrorException(message);
  }

  // Default case - throw as internal server error with the actual error message
  throw new InternalServerErrorException(message);
}
