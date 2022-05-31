import {
  Controller,
  Get,
  Post,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
    const getProjectDashboards = await this.dashboardService.getProjectDashboards();
    return getProjectDashboards;
  }
}
