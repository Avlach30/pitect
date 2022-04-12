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

import { MarketplaceService } from './marketplace.service';

@Controller('api/marketplace')
export class MarketplaceControllers {
  constructor(private marketplaceService: MarketplaceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('product')
  @HttpCode(201)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async createProduct(
    @Request() req: any,
    @UploadedFile() file: any,
    @Body('title') title: string,
    @Body('cost') cost: number,
    @Body('description') description: string,
    @Body('category') category: string,
  ) {
    const createProduct = await this.marketplaceService.createProduct(
      req,
      file,
      title,
      cost,
      description,
      category,
    );
    return createProduct;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('service')
  @HttpCode(201)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async createService(
    @Request() req: any,
    @UploadedFile() file: any,
    @Body('title') title: string,
    @Body('cost') cost: number,
    @Body('description') description: string,
    @Body('category') category: string,
    @Body('infoTitle1') infoTitle1: string,
    @Body('infoContent1') infoContent1: string,
    @Body('infoDuration1') infoDuration1: number,
    @Body('infoCost1') infoCost1: number,
    @Body('infoTitle2') infoTitle2: string,
    @Body('infoContent2') infoContent2: string,
    @Body('infoDuration2') infoDuration2: number,
    @Body('infoCost2') infoCost2: number,
    @Body('infoTitle3') infoTitle3: string,
    @Body('infoContent3') infoContent3: string,
    @Body('infoDuration3') infoDuration3: number,
    @Body('infoCost3') infoCost3: number,
  ) {
    const createService = await this.marketplaceService.createService(
      req,
      file,
      title,
      cost,
      description,
      category,
      infoTitle1,
      infoContent1,
      infoDuration1,
      infoCost1,
      infoTitle2,
      infoContent2,
      infoDuration2,
      infoCost2,
      infoTitle3,
      infoContent3,
      infoDuration3,
      infoCost3,
    );
    return createService;
  }
}
