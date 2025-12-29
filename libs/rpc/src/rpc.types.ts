export type RpcErrorCode =
  | 'UNKNOWN_ERROR'
  | 'INVALID_REQUEST'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR';

export type RpcErrorPayload = {
  code: RpcErrorCode;
  message: string;
  details?: any;
};
