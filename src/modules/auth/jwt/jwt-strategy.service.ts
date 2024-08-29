import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/entities/users.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, // Cambié el nombre a `usersService`
  ) {
    super({
      secretOrKeyProvider: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_CLIENT_ID'),
      issuer: `https://${configService.get('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: Partial<User>) {
    if (
      !payload.email ||
      !payload.name ||
      !payload.phone ||
      !payload.password
    ) {
      throw new Error('Payload incompleto');
    }

    let user = await this.usersService.getUsersByEmailService(payload.email);

    if (!user) {
      const newUser = await this.usersService.addUserService({
        email: payload.email,
        name: payload.name,
        password: payload.password,
        phone: payload.phone,
      });

      return { userId: newUser.id, email: newUser.email };
    }
  }
}
