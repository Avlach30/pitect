import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Projects } from './project.entity';
import { isAuth } from '../user/middleware/is-auth';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectMembers } from './members/project-member.entity';
import { ProjectBudgets } from './budgets/project-budget.entity';
import { ProjectTasks } from './tasks/project-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([ProjectBudgets]),
    TypeOrmModule.forFeature([ProjectMembers]),
    TypeOrmModule.forFeature([ProjectTasks]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
    }),
  ],
  controllers: [ProjectController],
  providers: [isAuth, ProjectService],
})
export class ProjectModule {}
