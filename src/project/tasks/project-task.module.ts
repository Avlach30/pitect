import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { isAuth } from '../../middleware/is-auth';
import { ProjectTasks } from '../../entity/project-task.entity';
import { ProjectTaskService } from './project-task.service';
import { Projects } from '../../entity/project.entity';
import { ProjectTaskController } from './project-task.controller';
import { ProjectMembers } from '../../entity/project-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectTasks]),
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([ProjectMembers]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
      signOptions: { expiresIn: '120s' },
    }),
  ],
  controllers: [ProjectTaskController],
  providers: [isAuth, ProjectTaskService],
})
export class ProjectTaskModule {}
