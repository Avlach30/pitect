import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '4h' },
      }),
    }),
  ],
  controllers: [AuthController, UserController, ProfileController],
  providers: [isAuth, UserService],
})
export class UserModule {}
