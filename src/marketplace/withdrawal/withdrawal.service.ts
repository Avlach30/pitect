import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orders } from '../../entity/order.entity';
import { Withdrawals } from '../../entity/withdrawal.entity';
import { Banks } from '../../entity/bank.entity';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    @InjectRepository(Withdrawals)
    private withdrawalRepository: Repository<Withdrawals>,
    @InjectRepository(Banks) private bankRepository: Repository<Banks>,
  ) {}
}
