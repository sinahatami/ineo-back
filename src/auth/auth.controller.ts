import { Controller, Post, Body, Req, UseGuards, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';
import { Public } from './public-decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() loginDto: { username: string; password: string }) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile')
    getProfile(@Req() req) {
        return req.user;
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        res.clearCookie('access_token');
        res.status(HttpStatus.OK).json([]);
    }
}
