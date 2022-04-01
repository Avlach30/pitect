import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectMembers } from './members/project-member.entity';
import { Projects } from './project.entity';
import { ProjectBudgets } from './budgets/project-budget.entity';
import { ProjectTasks } from './tasks/project-task.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Projects) private projectRepository: Repository<Projects>,
    @InjectRepository(ProjectMembers)
    private projectMemberRepository: Repository<ProjectMembers>,
    @InjectRepository(ProjectBudgets)
    private projectBudgetRepository: Repository<ProjectBudgets>,
    @InjectRepository(ProjectTasks)
    private projectTaskRepository: Repository<ProjectTasks>,
  ) {}

  async createProject(
    @Request() req: any,
    title: string,
    totalContract: number,
    startDate: string,
    finishDate: string,
    address: string,
  ) {
    if (!title || !totalContract || !startDate || !finishDate || !address) {
      throw new BadRequestException('Please input all fields');
    }

    const newProject = await this.projectRepository.query(
      'INSERT INTO projects (title, admin, totalContract, startDate, finishDate, address) VALUES (?, ?, ?, ?, ?, ?)',
      [
        title,
        parseInt(req.user.userId),
        totalContract,
        startDate,
        finishDate,
        address,
      ],
    );

    // console.log(newProject);

    const newProjectMemberLoggedUser = await this.projectMemberRepository.query(
      'INSERT INTO projectmembers (user, project) VALUES (?, ?)',
      [parseInt(req.user.userId), newProject.insertId],
    );

    const getInitiatedBudget = await this.projectRepository.query(
      'SELECT totalContract as cost FROM projects WHERE id = ?',
      [newProject.insertId],
    );

    const insertInitiatedBudget = await this.projectBudgetRepository.query(
      "INSERT INTO projectbudgets (projectId, date, content, amount, cost) VALUES (?, CURDATE(), 'Kontrak Awal', 0, ?)",
      [newProject.insertId, getInitiatedBudget[0].cost],
    );

    const insertInitiatedTask = await this.projectTaskRepository.query(
      "INSERT INTO tasks (content, projectId) VALUES ('Perancangan Kontruksi', ?)",
      [newProject.insertId],
    );

    let mappingInsertResult;
    const insertQuery = await this.projectMemberRepository
      .query(
        'SELECT projects.id as id, projects.title as name, users.FULLNAME as admin, projects.totalContract, projects.startDate, projects.finishDate, DATEDIFF(projects.finishDate, projects.startDate) as durasi, projects.address FROM projects INNER JOIN users ON projects.admin = users.USERID WHERE projects.id = ? GROUP BY projects.id',
        [newProject.insertId],
      )
      .then((data) => {
        mappingInsertResult = data;
        return mappingInsertResult;
      });

    // console.log(mappingInsertResult);

    const result = mappingInsertResult.map((item) => {
      const objResult = {
        message: 'Created project successfully',
        data: {
          id: item.id,
          title: item.name,
          admin: item.admin,
          dates: {
            start: item.startDate,
            finish: item.finishDate,
            duration: item.durasi,
          },
        },
      };

      return objResult;
    });

    return result[0];
  }

  async fetchProjects(@Request() req: any) {
    let fetchProjectResult;
    const fetchProjects = await this.projectRepository
      .query(
        'SELECT projects.id as id, projects.title as name, users.FULLNAME as admin, projects.totalContract, GROUP_CONCAT(projectbudgets.id) as budgetId, GROUP_CONCAT(projectbudgets.cost) as costs, GROUP_CONCAT(projectbudgets.content) as descBudget, datediff(projects.finishDate, projects.startDate) as durasi FROM projectbudgets INNER JOIN projects ON projectbudgets.projectId = projects.id INNER JOIN users ON projects.admin = users.USERID WHERE EXISTS(SELECT 1 from projectbudgets where projectbudgets.projectId = projects.id) AND projects.admin = ? GROUP BY projects.id',
        [parseInt(req.user.userId)],
      )
      .then((data) => {
        fetchProjectResult = data;
        return fetchProjectResult;
      });

    // console.log(fetchProjectResult);

    //* Get array of costs
    const arrCostLists = fetchProjectResult.map((item) => {
      const arrCost = item.costs.split(',').map((cost) => parseInt(cost));
      return arrCost;
    });

    //* Mapping array of cost for get a sum value
    const mappingValue = fetchProjectResult.map((item, idx) => {
      const initiatedBudget = arrCostLists[idx][0];

      const sumValue = arrCostLists[idx].reduce((prev, current) => {
        return prev + current;
      }, 0);

      const totalRealization = sumValue - initiatedBudget;

      const objItem = {
        id: item.id,
        name: item.name,
        admin: item.admin,
        contractTotal: item.totalContract,
        totalCost: totalRealization,
        workDuration: item.durasi,
      };

      return objItem;
    });

    //* Mapping array untuk mendapatkan data total kontrak, total pengeluaran, dan sisa anggaran
    const arrTotalContracts = mappingValue.map((item, idx) => {
      return item.contractTotal;
    });

    const arrTotalSpendings = mappingValue.map((item) => {
      return item.totalCost;
    });

    // console.log(arrTotalContracts);
    // console.log(arrTotalSpendings);

    const sumContracts = arrTotalContracts.reduce((prev, current) => {
      return prev + current;
    }, 0);
    // console.log(sumContracts);

    const sumSpendings = arrTotalSpendings.reduce((prev, current) => {
      return prev + current;
    }, 0);

    const remainingBudget = sumContracts - sumSpendings;

    //* Count percentage
    const percentageSpendings = (sumSpendings / sumContracts) * 100;
    const percentageRemainBudget = (remainingBudget / sumContracts) * 100;
    // console.log(Math.round(percentageSpendings));
    // console.log(Math.round(percentageRemainBudget));

    return {
      message: 'Success fetched all projects',
      data: {
        projects: mappingValue,
        budgets: {
          sumContracts,
          sumSpendings,
          remainingBudget,
        },
        percentageBudgets: {
          spending: Math.round(percentageSpendings),
          remainBudget: Math.round(percentageRemainBudget),
        },
      },
    };
  }

  async getSpecifiedProject(projectId: string, @Request() req: any) {
    let getResult;

    const project = await this.projectRepository
      .query(
        'SELECT projects.id as id, projects.title as title, users.FULLNAME as admin, projects.admin as adminId, projects.totalContract as totalContract, projects.startDate as start, projects.finishDate as finish, projects.address as address FROM projects INNER JOIN users ON projects.admin = users.USERID WHERE projects.id = ?',
        [parseInt(projectId)],
      )
      .then((data) => {
        getResult = data[0];
        return getResult;
      });

    // console.log(getResult);

    if (getResult == undefined) {
      throw new NotFoundException('Project not found');
    }

    const projectMember = await this.projectMemberRepository.query(
      'SELECT projectmembers.id as id, users.FULLNAME as name FROM projectmembers INNER JOIN users ON projectmembers.user = users.USERID WHERE projectmembers.project = ?',
      [getResult.id],
    );

    // console.log(projectMember);

    const projectTask = await this.projectTaskRepository.query(
      'SELECT id, content, isFinished FROM tasks WHERE projectId = ?',
      [getResult.id],
    );

    const projectSpending = await this.projectBudgetRepository.query(
      'SELECT id, content, cost FROM projectbudgets WHERE projectId = ? AND content != ?',
      [getResult.id, 'Kontrak Awal'],
    );

    // const sumSpending = projectSpending
    //   .map((spend) => spend.cost)
    //   .reduce((prev, current) => prev + current, 0);

    // console.log(projectSpending);

    const result = {
      message: 'Fetch single project successfully',
      project: getResult,
      spendings: projectSpending,
      members: projectMember,
      tasks: projectTask,
    };

    return result;
  }

  async updateProject(
    projectId: string,
    @Request() req: any,
    title: string,
    address: string,
  ) {
    if (!title || !address) {
      throw new BadRequestException('Please input all fields');
    }

    //*Find project data from params
    const project = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE projects.id = ?',
      [parseInt(projectId)],
    );

    if (project.length < 1) {
      throw new NotFoundException('Project not found');
    }

    if (project[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const updateProject = await this.projectRepository.query(
      'UPDATE projects SET title = ?, address = ? WHERE id = ?',
      [title, address, parseInt(projectId)],
    );

    const updateResult = await this.projectRepository.query(
      'SELECT id, title, address FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    const result = {
      message: 'Update project successfully',
      data: updateResult,
    };

    return result;
  }

  async deleteProject(projectId: string, @Request() req: any) {
    //*Find project data from params
    const project = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE projects.id = ?',
      [parseInt(projectId)],
    );

    if (project.length < 1) {
      throw new NotFoundException('Project not found');
    }

    if (project[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const deleteProject = await this.projectRepository.query(
      'DELETE FROM projects WHERE projects.id = ?',
      [parseInt(projectId)],
    );

    const result = {
      message: 'Delete project successfully',
    };

    return result;
  }
}
