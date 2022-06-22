import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

import { ProjectGalleryService } from './project-gallery.service';

@Controller('api/projects/:projectId/galleries')
export class ProjectGalleryController {
  constructor(private projectGalleryService: ProjectGalleryService) {}

  @Get()
  @HttpCode(200)
  async getProjectGalleries(@Param('projectId') projectId: string) {
    const getProjectGalleries =
      await this.projectGalleryService.getProjectGalleries(projectId);
    return getProjectGalleries;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async createProjectGallery(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @UploadedFile() file: any,
    @Body('description') description: string,
    @Body('date') date: string,
  ) {
    const createProjectGallery =
      await this.projectGalleryService.createProjectGallery(
        projectId,
        req,
        file,
        description,
        date,
      );
    return createProjectGallery;
  }
}
