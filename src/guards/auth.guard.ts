import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Roll } from 'src/modules/entities/users.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se envió token');

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify(token, { secret });
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
