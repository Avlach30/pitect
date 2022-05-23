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
}
