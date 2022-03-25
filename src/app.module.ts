import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ProjectBudgetModule } from './project/budgets/project-budget.module';
import { ProjectTaskModule } from './project/tasks/project-task.module';
import { ProjectMemberModule } from './project/members/project-member.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'pitect',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, 'src', 'migrations', '**', '*.{ts,js}')],
      synchronize: false,
      cli: {
        migrationsDir: 'src/migrations',
      },
    }),
    UserModule,
    ProjectModule,
    ProjectMemberModule,
    ProjectBudgetModule,
    ProjectTaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
