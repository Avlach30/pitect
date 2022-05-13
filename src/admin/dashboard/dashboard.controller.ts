import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
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
}
