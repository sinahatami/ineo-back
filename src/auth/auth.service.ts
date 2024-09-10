import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { config as dotenvConfig } from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenvConfig({ path: envFile })
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1h',
            }),
        };
    }
}
