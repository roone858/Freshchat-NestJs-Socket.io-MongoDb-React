import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addMember')
  addMember(
    @Req() request: Request,
    @Body() createUserDto: CreateUserDto & { role: 'ADMIN' | 'MEMBER' },
  ) {
    if (!(request.user as any)._doc.isAdmin) {
      throw new UnauthorizedException();
    }

    const teamId = (request.user as any)._doc.teamId;
    return this.usersService.addMember(teamId, createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/removeMember')
  removeMember(@Req() request: Request, @Param('id') id: string) {
    if (!(request.user as any)._doc.isAdmin) {
      throw new UnauthorizedException();
    }

    const teamId = (request.user as any)._doc.teamId;
    return this.usersService.removeMember(teamId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: Request) {
    return {
      ...(request.user as any)._doc,
      password: undefined,
      deviceTokens: undefined,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOneForUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
