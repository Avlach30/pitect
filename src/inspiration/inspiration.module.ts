import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inspirations } from '../entity/inspiration.entity';
import { isAuth } from '../middleware/is-auth';
import { InspirationController } from './inspiration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Inspirations])],
  controllers: [InspirationController],
  providers: [isAuth],
})
export class InspirationModule {}
