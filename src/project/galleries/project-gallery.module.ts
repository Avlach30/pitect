import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterExtendedModule } from 'nestjs-multer-extended';

import { isAuth } from '../../middleware/is-auth';
import { Projects } from '../../entity/project.entity';
import { ProjectMembers } from '../../entity/project-member.entity';
import { ProjectGalleries } from '../../entity/project-gallery.entity';
import { ProjectGalleryController } from './project-gallery.controller';
import { ProjectGalleryService } from './project-gallery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([ProjectMembers]),
    TypeOrmModule.forFeature([ProjectGalleries]),
    MulterExtendedModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        awsConfig: {
          credentials: {
            accessKeyId: config.get<string>('AWS_S3_ACESS_KEY'),
            secretAccessKey: config.get<string>('AWS_S3_SECRET_ACCESS_KEY'),
          },
          region: config.get<string>('AWS_S3_BUCKET_REGION'),
        },
        bucket: config.get<string>('AWS_S3_BUCKET_NAME'),
        basePath: 'project-gallery',
      }),
    }),
  ],
  controllers: [ProjectGalleryController],
  providers: [isAuth, ProjectGalleryService],
})
export class ProjectGalleryModule {}
