import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Request,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

@Controller('api/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(
    @Body('name') name: string,
    @Body('type') type: string,
    @Body('numberPhone') numberPhone: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const signUp = await this.userService.signup(
      name,
      type,
      numberPhone,
      email,
      password,
    );
    return signUp;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const login = await this.userService.login(email, password);
    return login;
  }
}

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async searchUser(@Query('name') name: any, @Request() req: any) {
    const user = await this.userService.searchUser(name, req);
    return {
      searchResult: user,
    };
  }
}
