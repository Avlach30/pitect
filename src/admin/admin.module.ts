import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { Projects } from '../entity/project.entity';
import { Users } from '../entity/user.entity';
import { Orders } from '../entity/order.entity';
import { isAuth } from '../middleware/is-auth';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { Inspirations } from '../entity/inspiration.entity';
import { Services } from '../entity/services.entity';
import { Withdrawals } from '../entity/withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([Inspirations]),
    TypeOrmModule.forFeature([Services]),
    TypeOrmModule.forFeature([Withdrawals]),
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
        basePath: 'withdrawal-slip',
      }),
    }),
  ],
  controllers: [DashboardController],
  providers: [isAuth, DashboardService],
})
export class AdminModule {}
