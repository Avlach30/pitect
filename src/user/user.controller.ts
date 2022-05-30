import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Request,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

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
  @Post()
  @HttpCode(200)
  async searchUser(@Body('name') name: any, @Request() req: any) {
    const user = await this.userService.searchUser(name, req);
    return {
      searchResult: user,
    };
  }
}

@Controller('api/profile')
export class ProfileController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getUser(@Request() req: any) {
    const user = await this.userService.getUser(req);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(200)
  async updateProfile(
    @Request() req: any,
    @Body('name') name: string,
    @Body('type') type: string,
    @Body('numberPhone') numberPhone: string,
    @Body('email') email: string,
    @Body('facebook') facebook: string,
    @Body('instagram') instagram: string,
  ) {
    const updateProfile = await this.userService.updateProfile(
      req,
      name,
      type,
      numberPhone,
      email,
      facebook,
      instagram,
    );
    return updateProfile;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @HttpCode(202)
  async deleteProfile(@Request() req: any) {
    const deleteProfile = await this.userService.deleteProfile(req);
    return deleteProfile;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('photo')
  @HttpCode(200)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async updateAvatarProfile(@Request() req: any, @UploadedFile() file: any) {
    const updateAvatarProfile = await this.userService.updateAvatarProfile(
      req,
      file,
    );
    return updateAvatarProfile;
  }
}
