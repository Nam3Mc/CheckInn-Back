import { SetMetadata } from '@nestjs/common';
import { Roll } from 'src/modules/entities/users.entity';

export const ROLES_KEY = 'roles';

// Crea el decorador @Rolls
export const Rolls = (...roles: Roll[]) => SetMetadata(ROLES_KEY, roles);
