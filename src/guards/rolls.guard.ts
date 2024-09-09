import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roll } from 'src/modules/entities/users.entity';

@Injectable()
export class RollsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRolls = this.reflector.getAllAndOverride<Roll[]>('rolls', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User role:', user?.roll); // Log para verificar el rol del usuario
    console.log('Required roles:', requiredRolls); // Log para verificar los roles requeridos

    if (!user || !requiredRolls.includes(user.roll)) {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }

    return true;
  }
}
