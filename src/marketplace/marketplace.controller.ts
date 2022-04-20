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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getCatalogs(@Request() req: any) {
    const getCatalogs = await this.marketplaceService.getMarketplaceCatalogs(
      req,
    );
    return getCatalogs;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(200)
  async filteredCatalogs(
    @Body('search') search: string,
    @Body('category') category: string,
    @Body('minPrice') minPrice: number,
    @Body('maxPrice') maxPrice: number,
  ) {
    const filteredResult = await this.marketplaceService.filteredCatalogs(
      search,
      category,
      minPrice,
      maxPrice,
    );
    return {
      filteredResult: filteredResult,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/catalogs/:catalogId')
  @HttpCode(200)
  async getProject(@Param('catalogId') catalogId: string, @Request() req: any) {
    const getSpecifiedCatalog =
      await this.marketplaceService.getSpecifiedCatalog(catalogId, req);
    return getSpecifiedCatalog;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('wishlists')
  @HttpCode(201)
  async addToWishlist(
    @Body('catalogId') catalogId: number,
    @Request() req: any,
  ) {
    const insertToWishlist = await this.marketplaceService.insertToWishlist(
      req,
      catalogId,
    );
    return insertToWishlist;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('wishlists')
  @HttpCode(200)
  async getWishlists(@Request() req: any) {
    const getWishlists = await this.marketplaceService.getWishlists(req);
    return getWishlists;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('wishlists/:wishlistId')
  @HttpCode(202)
  async removeFromWishlist(
    @Param('wishlistId') wishlistId: string,
    @Request() req: any,
  ) {
    const removeFromWishlist = await this.marketplaceService.removeFromWishlist(
      wishlistId,
      req,
    );
    return removeFromWishlist;
  }

  @Put('product/:productId')
  @HttpCode(200)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async updateProduct(
    @Param('productId') productId: string,
    @Request() req: any,
    @UploadedFile() file: any,
    @Body('title') title: string,
    @Body('cost') cost: number,
    @Body('description') description: string,
    @Body('category') category: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    const updateProduct = await this.marketplaceService.updateProduct(
      productId,
      req,
      file,
      title,
      cost,
      description,
      category,
      imageUrl,
    );
    return updateProduct;
  }
}
