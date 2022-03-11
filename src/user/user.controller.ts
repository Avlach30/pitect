import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
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
    return {
      message: 'User signup successfully',
      user: signUp,
    };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const login = await this.userService.login(email, password);
    return {
      message: 'Login successfully',
      token: login,
    };
  }
}

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async searchUser(@Query('name') name: any, @Request() req: any) {
    const user = await this.userService.searchUser(name, req);
    return {
      searchResult: user,
    };
  }
}
