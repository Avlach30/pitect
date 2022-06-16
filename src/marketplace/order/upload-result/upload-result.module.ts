import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterExtendedModule } from 'nestjs-multer-extended';
import { ConfigService } from '@nestjs/config';

import { Users } from '../../../entity/user.entity';
import { Orders } from '../../../entity/order.entity';
import { OrderItems } from '../../../entity/order-item.entity';
import { isAuth } from '../../../middleware/is-auth';
import { UploadResultController } from './upload-result.controller';
import { UploadResultService } from './upload-result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([OrderItems]),
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
        basePath: 'services-result',
      }),
    }),
  ],
  controllers: [UploadResultController],
  providers: [isAuth, UploadResultService],
})
export class UploadResultModule {}
