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
}
