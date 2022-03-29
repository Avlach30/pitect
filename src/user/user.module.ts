import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import {
  AuthController,
  ProfileController,
  UserController,
} from './user.controller';
import { UserService } from './user.service';
import { Users } from '../entity/user.entity';
import { isAuth } from '../middleware/is-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
      signOptions: {
        expiresIn: '4h',
      },
    }),
  ],
  controllers: [AuthController, UserController, ProfileController],
  providers: [UserService, isAuth],
})
export class UserModule {}
