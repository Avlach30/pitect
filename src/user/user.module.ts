import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import {
  AuthController,
  ProfileController,
  UserController,
} from './user.controller';
import { UserService } from './user.service';
import { Users } from './user.entity';
import { isAuth } from './middleware/is-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    MulterExtendedModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        awsConfig: {
          credentials: {
            accessKeyId: config.get<string>('AWS_S3_ACESS_KEY'),
            secretAccessKey: config.get<string>('AWS_S3_SECRET_ACCESS_KEY'),
          },
          region: config.get<string>('AWS_S3_BUCKET_REGION'),
        },
        bucket: config.get<string>('AWS_S3_BUCKET_NAME'),
        basePath: 'pitect-user-avatar',
      }),
    }),
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
