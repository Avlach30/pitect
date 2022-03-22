import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { isAuth } from '../../user/middleware/is-auth';
import { ProjectBudgets } from './project-budget.entity';
import { Projects } from '../project.entity';
import {
  ProjectBudgetController,
  UpdateBudgetController,
} from './project-budget.controller';
import { ProjectBudgetService } from './project-budget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectBudgets]),
    TypeOrmModule.forFeature([Projects]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
      signOptions: { expiresIn: '120s' },
    }),
  ],
  controllers: [ProjectBudgetController, UpdateBudgetController],
  providers: [isAuth, ProjectBudgetService],
})
export class ProjectBudgetModule {}
