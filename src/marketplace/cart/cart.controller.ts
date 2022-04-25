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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CartService } from './cart.service';

@Controller('api/marketplace')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/catalogs/:catalogId/cart')
  @HttpCode(201)
  async addToCart(
    @Request() req: any,
    @Param('catalogId') catalogId: string,
    @Body('catalogItemId') catalogItemId: number,
  ) {
    const addToCart = await this.cartService.addToCart(
      req,
      catalogId,
      catalogItemId,
    );
    return addToCart;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('carts')
  @HttpCode(200)
  async getCarts(@Request() req: any) {
    const getCarts = await this.cartService.getCarts(req);
    return getCarts;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('carts/:cartItemId')
  @HttpCode(202)
  async deleteFromCart(
    @Request() req: any,
    @Param('cartItemId') cartItemId: string,
  ) {
    const deleteFromCart = await this.cartService.deleteFromCart(
      req,
      cartItemId,
    );
    return deleteFromCart;
  }
}
