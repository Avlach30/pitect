import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { isAuth } from '../../middleware/is-auth';
import { ProjectBudgets } from '../../entity/project-budget.entity';
import { Projects } from '../../entity/project.entity';
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
      signOptions: {
        expiresIn: '4h',
      },
    }),
  ],
  controllers: [ProjectBudgetController, UpdateBudgetController],
  providers: [isAuth, ProjectBudgetService],
})
export class ProjectBudgetModule {}
