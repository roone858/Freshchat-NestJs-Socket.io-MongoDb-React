import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('forgot-password')
  forgotPassword(@Body() data: any) {
    return this.authService.forgotPassword(data.email);
  }
  @Post('verify-reset-code')
  verifyResetCode(@Body() data: any) {
    return this.authService.verifyResetCode(data);
  }
  @Post('reset-password')
  resetPassword(@Body() data: any) {
    return this.authService.resetPassword(data);
  }
}
