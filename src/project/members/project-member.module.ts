import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ProjectMembers } from './project-member.entity';
import { isAuth } from '../../user/middleware/is-auth';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { Projects } from '../project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMembers]),
    TypeOrmModule.forFeature([Projects]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
      signOptions: { expiresIn: '120s' },
    }),
  ],
  controllers: [ProjectMemberController],
  providers: [isAuth, ProjectMemberService],
})
export class ProjectMemberModule {}
