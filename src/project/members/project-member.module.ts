import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMembers } from '../../entity/project-member.entity';
import { isAuth } from '../../middleware/is-auth';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { Projects } from '../../entity/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMembers]),
    TypeOrmModule.forFeature([Projects]),
  ],
  controllers: [ProjectMemberController],
  providers: [isAuth, ProjectMemberService],
})
export class ProjectMemberModule {}
