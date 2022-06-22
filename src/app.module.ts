import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ProjectBudgetModule } from './project/budgets/project-budget.module';
import { ProjectTaskModule } from './project/tasks/project-task.module';
import { ProjectMemberModule } from './project/members/project-member.module';
import { AdminModule } from './admin/admin.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { CartModule } from './marketplace/cart/cart.module';
import { OrderModule } from './marketplace/order/order.module';
import { InspirationModule } from './inspiration/inspiration.module';
import { UploadResultModule } from './marketplace/order/upload-result/upload-result.module';
import { WithdrawalModule } from './marketplace/withdrawal/withdrawal.module';
import { ProjectGalleryModule } from './project/galleries/project-gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: 3306,
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, 'src', 'migrations', '**', '*.{ts,js}')],
        synchronize: false,
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),
    }),
    UserModule,
    ProjectModule,
    ProjectMemberModule,
    ProjectBudgetModule,
    ProjectTaskModule,
    AdminModule,
    MarketplaceModule,
    CartModule,
    OrderModule,
    InspirationModule,
    UploadResultModule,
    WithdrawalModule,
    ProjectGalleryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
