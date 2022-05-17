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

import { OrderService } from './order.service';

@Controller('api/marketplace')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('orders')
  @HttpCode(201)
  async createOrder(@Request() req: any) {
    const createOrder = await this.orderService.createOrder(req);
    return createOrder;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  @HttpCode(200)
  async getOrders(@Request() req: any) {
    const getOrders = await this.orderService.getOrders(req);
    return getOrders;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders/:orderId')
  @HttpCode(200)
  async getSingleOrder(@Request() req: any, @Param('orderId') orderId: string) {
    const getSingleOrder = await this.orderService.getSingleOrder(req, orderId);
    return getSingleOrder;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('orders/:orderId/upload-slip')
  @HttpCode(201)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async uploadSlip(
    @Request() req: any,
    @UploadedFile() file: any,
    @Param('orderId') orderId: string,
  ) {
    const uploadSlip = await this.orderService.uploadSlip(req, file, orderId);
    return uploadSlip;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('orders/:orderId/done')
  @HttpCode(200)
  async doneOrder(@Request() req: any, @Param('orderId') orderId: string) {
    const doneOrder = await this.orderService.doneOrder(req, orderId);
    return doneOrder;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('seller/orders')
  @HttpCode(200)
  async getSellerOrder(@Request() req: any) {
    const getSellerOrder = await this.orderService.getSellerOrders(req);
    return getSellerOrder;
  }
}
