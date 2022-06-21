import {
  Controller,
  Request,
  Get,
  Post,
  Put,
  HttpCode,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

import { DashboardService } from './dashboard.service';

@Controller('api/admin/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getDashboards() {
    const getDashboards = await this.dashboardService.getDashboards();
    return getDashboards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  @HttpCode(200)
  async getOrderDashboards() {
    const getOrderDashboards = await this.dashboardService.getOrderDashboards();
    return getOrderDashboards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('orders/:orderId/verification')
  @HttpCode(201)
  async confirmOrder(@Param('orderId') orderId: string) {
    const confirmOrder = await this.dashboardService.confirmOrder(orderId);
    return confirmOrder;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  @HttpCode(200)
  async getUserDashboards() {
    const getUserDashboards = await this.dashboardService.getUserDashboards();
    return getUserDashboards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('projects')
  @HttpCode(200)
  async getProjectDashboards() {
    const getProjectDashboards =
      await this.dashboardService.getProjectDashboards();
    return getProjectDashboards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('catalogs')
  @HttpCode(200)
  async getServiceCatalogDashboards() {
    const getServiceCatalogDashboards =
      await this.dashboardService.getServiceCatalogDashboards();
    return getServiceCatalogDashboards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('inspirations')
  @HttpCode(200)
  async getInspirationDashboards() {
    const getInspirationDashboards =
      await this.dashboardService.getInspirationDashboards();
    return getInspirationDashboards;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('withdrawal/:withdrawalId/verification')
  @HttpCode(200)
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      limits: { fileSize: 1 * 1024 * 1024 },
      randomFilename: true,
    }),
  )
  async verificationWithdrawalRequest(
    @Request() req: any,
    @Param('withdrawalId') withdrawalId: string,
    @UploadedFile() file: any,
  ) {
    const verificationWithdrawalRequest =
      await this.dashboardService.verificationWithdrawalRequest(
        req,
        withdrawalId,
        file,
      );
    return verificationWithdrawalRequest;
  }
}
