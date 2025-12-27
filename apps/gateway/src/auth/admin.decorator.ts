import { SetMetadata } from '@nestjs/common';

export const REQUIRED_ROLE_KEY = 'requiredRole';

export const adminOnly = () => SetMetadata(REQUIRED_ROLE_KEY, 'admin');
