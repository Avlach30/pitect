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
}
