import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterExtendedModule } from 'nestjs-multer-extended';
import { ConfigService } from '@nestjs/config';

import { Users } from '../../entity/user.entity';
import { Carts } from '../../entity/cart.entity';
import { Orders } from '../../entity/order.entity';
import { OrderItems } from '../../entity/order-item.entity';
import { CartItems } from '../../entity/cart-item.entity';
import { isAuth } from '../../middleware/is-auth';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderReviews } from '../../entity/order-review.entity';
import { Services } from '../../entity/services.entity';
import { ServiceInfos } from '../../entity/services.info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([OrderItems]),
    TypeOrmModule.forFeature([OrderReviews]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Carts]),
    TypeOrmModule.forFeature([CartItems]),
    TypeOrmModule.forFeature([Services]),
    TypeOrmModule.forFeature([ServiceInfos]),
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
        basePath: 'slip-transfers',
      }),
    }),
  ],
  controllers: [OrderController],
  providers: [isAuth, OrderService],
})
export class OrderModule {}
