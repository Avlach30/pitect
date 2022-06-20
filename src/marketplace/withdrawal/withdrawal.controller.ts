import {
  Controller,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Body,
  Post,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WithdrawalService } from './withdrawal.service';

@Controller('api/marketplace')
export class WithdrawalController {
  constructor(private withdrawalService: WithdrawalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('withdrawals')
  @HttpCode(200)
  async getWithdrawals(@Request() req: any) {
    const getWithdrawals = await this.withdrawalService.getWithdrawals(req);
    return getWithdrawals;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('withdrawal/banks')
  @HttpCode(200)
  async getBanks(@Request() req: any) {
    const getBanks = await this.withdrawalService.getBanks(req);
    return getBanks;
  }
}
