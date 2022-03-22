import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProjectBudgetService } from './project-budget.service';

@Controller('api/projects/:projectId/budgets')
export class ProjectBudgetController {
  constructor(private projectBudgetService: ProjectBudgetService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getSpendingBudgets(
    @Request() req: any,
    @Param('projectId') projectId: string,
  ) {
    const getSpendingBudgets = await this.projectBudgetService.fetchBudgets(
      req,
      projectId,
    );

    return getSpendingBudgets;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  async addSpending(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body('date') date: string,
    @Body('content') content: string,
    @Body('amount') amount: number,
    @Body('cost') cost: number,
  ) {
    const addSpending = await this.projectBudgetService.addSpending(
      req,
      projectId,
      date,
      content,
      amount,
      cost,
    );

    return addSpending;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':budgetId')
  @HttpCode(202)
  async deleteSpending(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('budgetId') budgetId: string,
  ) {
    const deleteSpending = await this.projectBudgetService.deleteSpending(
      req,
      projectId,
      budgetId,
    );

    return deleteSpending;
  }
}

@Controller('api/projects/:projectId/updateBudget')
export class UpdateBudgetController {
  constructor(private projectBudgetService: ProjectBudgetService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  async updateBudget(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body('budget') budget: number,
  ) {
    const updateBudget = await this.projectBudgetService.updateContractBudget(
      req,
      projectId,
      budget,
    );

    return updateBudget;
  }
}
