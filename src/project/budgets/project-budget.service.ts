import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectBudgets } from './project-budget.entity';
import { Projects } from '../project.entity';

@Injectable()
export class ProjectBudgetService {
  constructor(
    @InjectRepository(ProjectBudgets)
    private projectBudgetRepository: Repository<ProjectBudgets>,
    @InjectRepository(Projects) private projectRepository: Repository<Projects>,
  ) {}

  async fetchBudgets(@Request() req: any, projectId: string) {
    let getBudgets;
    const projectBudgets = await this.projectBudgetRepository
      .query(
        'SELECT id, projectId, date, content, amount, cost FROM projectbudgets WHERE projectId = ? AND content != "Kontrak Awal"',
        [parseInt(projectId)],
      )
      .then((data) => {
        getBudgets = data;
        return getBudgets;
      });

    //* Get total contract of project
    let getValue;
    const totalContract = await this.projectRepository
      .query('SELECT totalContract FROM projects WHERE id = ?', [
        parseInt(projectId),
      ])
      .then((data) => {
        getValue = data[0];
        return getValue;
      });

    if (getBudgets.length < 1 && getValue === undefined) {
      throw new NotFoundException('Data not found');
    }

    const totalContractValue = getValue.totalContract;

    //* Get total of spending costs from project budgets
    const sumSpendings = projectBudgets
      .map((value) => value.cost)
      .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

    const objValue = {
      message: 'Fetch budgets successfully',
      data: {
        budgets: projectBudgets,
        report: {
          totalBudget: totalContractValue,
          totalSpending: sumSpendings,
          remainBudget: totalContractValue - sumSpendings,
        },
      },
    };
    return objValue;
  }

  async addSpending(
    @Request() req: any,
    projectId: string,
    date: string,
    content: string,
    amount: number,
    cost: number,
  ) {
    if (!date || !content || !amount || !cost) {
      throw new BadRequestException('Please input all fields');
    }

    //* Get id of project and id admin of project
    const getProjectData = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    if (getProjectData[0] == undefined) {
      throw new NotFoundException('Project not found');
    }

    if (getProjectData[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const insertQuery = await this.projectBudgetRepository.query(
      'INSERT INTO projectbudgets (projectId, date, content, amount, cost) VALUES (?, ?, ?, ?, ?)',
      [parseInt(projectId), date, content, amount, cost],
    );

    const objResult = {
      message: 'Add new project spending successfully',
    };

    return objResult;
  }

  async deleteSpending(
    @Request() req: any,
    projectId: string,
    budgetId: string,
  ) {
    //* Get id of project and id admin of project
    const getProjectData = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    const getProjectId = await this.projectRepository.query(
      'SELECT projects.admin FROM projects INNER JOIN projectbudgets ON projects.id = projectbudgets.projectId WHERE projectbudgets.id = ?',
      [parseInt(budgetId)],
    );

    //* Get id of project spending from params
    const getSpendingId = await this.projectBudgetRepository.query(
      'SELECT id FROM projectbudgets WHERE id = ?',
      [parseInt(budgetId)],
    );

    if (getProjectData[0] === undefined || getSpendingId[0] === undefined) {
      throw new NotFoundException('Data not found');
    }

    if (
      getProjectData[0].admin != parseInt(req.user.userId) ||
      getProjectId[0].admin != parseInt(req.user.userId)
    ) {
      throw new ForbiddenException('Unpermission to access');
    }

    const deleteQuery = await this.projectBudgetRepository.query(
      'DELETE FROM projectbudgets WHERE id = ?',
      [parseInt(budgetId)],
    );

    const objResult = {
      message: 'Delete existing project spending successfully',
    };

    return objResult;
  }

  async updateContractBudget(
    @Request() req: any,
    projectId: string,
    budget: number,
  ) {
    if (!budget) {
      throw new BadRequestException('Please input this field');
    }

    //* Get id admin and total contract of project
    const getProjectData = await this.projectRepository.query(
      'SELECT admin, totalContract FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    if (getProjectData[0] == undefined) {
      throw new NotFoundException('Project not found');
    }

    if (getProjectData[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const updatedBudgetValue = budget + getProjectData[0].totalContract;

    const updateQuery = await this.projectRepository.query(
      'UPDATE projects SET totalContract = ? WHERE id = ?',
      [updatedBudgetValue, parseInt(projectId)],
    );

    const objResult = {
      message: 'Update budget contract successfully',
      updatedBudget: updatedBudgetValue,
    };

    return objResult;
  }
}
