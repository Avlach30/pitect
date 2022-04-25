import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../../entity/user.entity';
import { Carts } from '../../entity/cart.entity';
import { CartItems } from '../../entity/cart-item.entity';
import { Services } from '../../entity/services.entity';
import { ServiceInfos } from '../../entity/services.info.entity';
import { isAuth } from '../../middleware/is-auth';
// import {  } from './cart.controller';
// import {  } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Services]),
    TypeOrmModule.forFeature([ServiceInfos]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Carts]),
    TypeOrmModule.forFeature([CartItems]),
  ],
  controllers: [],
  providers: [isAuth],
})
export class CartModule {}
