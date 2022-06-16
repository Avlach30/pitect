import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

import { UploadResultService } from './upload-result.service';

@Controller('api/marketplace')
export class UploadResultController {
  constructor(private uploadResultService: UploadResultService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('seller/orders/:orderId/upload-result')
  @HttpCode(201)
  @UseInterceptors(
    AmazonS3FileInterceptor('result', {
      limits: { fileSize: 3 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async uploadResult(
    @Request() req: any,
    @UploadedFile() file: any,
    @Param('orderId') orderId: string,
  ) {
    const uploadResult = await this.uploadResultService.uploadResult(
      req,
      file,
      orderId,
    );
    return uploadResult;
  }
}
