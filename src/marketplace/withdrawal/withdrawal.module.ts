import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { isAuth } from '../../middleware/is-auth';
import { Banks } from '../../entity/bank.entity';
import { Orders } from '../../entity/order.entity';
import { Withdrawals } from '../../entity/withdrawal.entity';

import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banks]),
    TypeOrmModule.forFeature([Orders]),
    TypeOrmModule.forFeature([Withdrawals]),
  ],
  controllers: [WithdrawalController],
  providers: [isAuth, WithdrawalService],
})
export class WithdrawalModule {}
