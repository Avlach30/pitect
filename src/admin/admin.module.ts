import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Projects } from '../entity/project.entity';
import { Users } from '../entity/user.entity';
import { Orders } from '../entity/order.entity';
import { isAuth } from '../middleware/is-auth';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Orders]),
  ],
  controllers: [DashboardController],
  providers: [isAuth, DashboardService],
})
export class AdminModule {}
