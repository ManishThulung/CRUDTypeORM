import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '../models/user.interface';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: User) {
    console.log('register Controller');

    return this.authService.registerAccoutnt(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  // login(@Body() user: User) {
  async login(@Request() req) {
    const result = await this.authService.login(req.user);
    const token = {
      access_token: result.access_token,
    };
    return token;
  }
}
