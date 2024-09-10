import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { Request } from 'express';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenvConfig({ path: envFile });
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected configService: ConfigService) {
        super({
            secretOrKey: configService.get<string>(process.env.JWT_SECRET),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true
        });
    }

    async validate(request: Request, payload: any) {
        const refreshToken = request.get('authentication')
        return { ...payload, refreshToken };
    }
}