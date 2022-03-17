import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ProjectMembers } from './project-member.entity';
import { isAuth } from '../../user/middleware/is-auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMembers]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
    }),
  ],
  controllers: [],
  providers: [isAuth],
})
export class ProjectMemberModule {}
