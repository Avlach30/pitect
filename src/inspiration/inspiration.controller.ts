import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

import { InspirationService } from './inspiration.service';

@Controller('api/inspirations')
export class InspirationController {
  constructor(private inspirationService: InspirationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getInspirations(@Request() req: any) {
    const getInspirations = await this.inspirationService.getInspirations(req);
    return getInspirations;
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
  async createInspiration(
    @Request() req: any,
    @UploadedFile() file: any,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    const createInspiration = await this.inspirationService.createInspiration(
      req,
      title,
      description,
      file,
    );
    return createInspiration;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':inspirationId')
  @HttpCode(200)
  async getDetailInspiration(@Param('inspirationId') inspirationId: string) {
    const getDetailInspiration =
      await this.inspirationService.getDetailInspiration(inspirationId);
    return getDetailInspiration;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':inspirationId')
  @HttpCode(200)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async updateInspiration(
    @Request() req: any,
    @Param('inspirationId') inspirationId: string,
    @UploadedFile() file: any,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    const updateInspiration = await this.inspirationService.updateInspiration(
      inspirationId,
      req,
      title,
      description,
      file,
    );
    return updateInspiration;
  }
}
