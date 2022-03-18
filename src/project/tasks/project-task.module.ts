import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { isAuth } from '../../user/middleware/is-auth';
import { ProjectTasks } from './project-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectTasks]),
    JwtModule.register({
      secret: 'this-is-ultimate-secret-Text!',
      signOptions: { expiresIn: '120s' },
    }),
  ],
  controllers: [],
  providers: [isAuth],
})
export class ProjectTaskModule {}
