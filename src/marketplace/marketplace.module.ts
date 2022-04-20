import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { ServiceOwns } from '../entity/services.own.entity';
import { Wishlists } from '../entity/wishlist.entity';
import { isAuth } from '../middleware/is-auth';
import { Services } from '../entity/services.entity';
import { ServiceInfos } from '../entity/services.info.entity';
import { MarketplaceControllers } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Services]),
    TypeOrmModule.forFeature([ServiceInfos]),
    TypeOrmModule.forFeature([ServiceOwns]),
    TypeOrmModule.forFeature([Wishlists]),
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
        basePath: 'marketplace',
      }),
    }),
  ],
  controllers: [MarketplaceControllers],
  providers: [isAuth, MarketplaceService],
})
export class MarketplaceModule {}
