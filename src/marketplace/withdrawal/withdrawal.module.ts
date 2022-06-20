import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { isAuth } from '../../middleware/is-auth';
import { Banks } from '../../entity/bank.entity';
import { Orders } from '../../entity/order.entity';
import { Withdrawals } from '../../entity/withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banks]),
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([Withdrawals]),
  ],
  controllers: [],
  providers: [isAuth],
})
export class MarketplaceModule {}
