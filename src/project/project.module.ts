import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Projects } from '../entity/project.entity';
import { isAuth } from '../middleware/is-auth';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectMembers } from '../entity/project-member.entity';
import { ProjectBudgets } from '../entity/project-budget.entity';
import { ProjectTasks } from '../entity/project-task.entity';
import { ProjectGalleries } from '../entity/project-gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([ProjectBudgets]),
    TypeOrmModule.forFeature([ProjectMembers]),
    TypeOrmModule.forFeature([ProjectTasks]),
    TypeOrmModule.forFeature([ProjectGalleries]),
  ],
  controllers: [ProjectController],
  providers: [isAuth, ProjectService],
})
export class ProjectModule {}
