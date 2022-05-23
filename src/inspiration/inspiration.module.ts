import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { Inspirations } from '../entity/inspiration.entity';
import { isAuth } from '../middleware/is-auth';
import { InspirationController } from './inspiration.controller';
import { InspirationService } from './inspiration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inspirations]),
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
        basePath: 'pitect-inspirations',
      }),
    }),
  ],
  controllers: [InspirationController],
  providers: [isAuth, InspirationService],
})
export class InspirationModule {}
