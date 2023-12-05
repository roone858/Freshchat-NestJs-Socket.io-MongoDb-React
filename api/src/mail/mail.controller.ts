import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { MailService } from './mail.service';

// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
)
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get(':username')
  sendChat(@Req() request: Request, @Param('username') username: string) {
    return this.mailService.sendUserConfirmation();
  }
}
