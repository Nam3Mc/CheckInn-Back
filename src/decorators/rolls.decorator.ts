import { SetMetadata } from '@nestjs/common';
import { Roll } from 'src/modules/entities/users.entity';

export const Rolls = (...rolls: Roll[]) => SetMetadata('rolls', rolls);
