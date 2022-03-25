import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Query,
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
    //* Fetching all projects with admin = id of user logged in
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
    const mappingProjects = fetchProjectResult.map((item, idx) => {
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
        workDuration: parseInt(item.durasi),
      };

      return objItem;
    });

    //* Mapping array untuk mendapatkan data total kontrak, total pengeluaran, dan sisa anggaran
    const arrTotalContracts = mappingProjects.map((item, idx) => {
      return item.contractTotal;
    });

    const arrTotalSpendings = mappingProjects.map((item) => {
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

    //* Fething all project with collaborator of user logged in
    const fetchCollabProjectId = await this.projectRepository.query(
      'SELECT projectmembers.project FROM projectmembers INNER JOIN projects ON projectmembers.project = projects.id WHERE projectmembers.user = ? AND projects.admin != ?',
      [parseInt(req.user.userId), parseInt(req.user.userId)],
    );

    // 'SELECT projects.id as id, projects.title as name, users.FULLNAME as admin, projects.totalContract, GROUP_CONCAT(projectbudgets.id) as budgetId, GROUP_CONCAT(projectbudgets.cost) as costs, GROUP_CONCAT(projectbudgets.content) as descBudget, datediff(projects.finishDate, projects.startDate) as durasi FROM projectbudgets INNER JOIN projects ON projectbudgets.projectId = projects.id INNER JOIN users ON projects.admin = users.USERID WHERE EXISTS(SELECT 1 from projectbudgets where projectbudgets.projectId = projects.id) AND projects.id = ? GROUP BY projects.id',
    //       [value.project],

    const arrProjectCollabId = fetchCollabProjectId.map(
      (value) => value.project,
    );

    // console.log(arrProjectCollabId);

    const fetchCollabProjects = await this.projectRepository.query(
      'SELECT projects.id as id, projects.title as name, users.FULLNAME as admin, projects.totalContract, GROUP_CONCAT(projectbudgets.id) as budgetId, GROUP_CONCAT(projectbudgets.cost) as costs, GROUP_CONCAT(projectbudgets.content) as descBudget, datediff(projects.finishDate, projects.startDate) as durasi FROM projectbudgets INNER JOIN projects ON projectbudgets.projectId = projects.id INNER JOIN users ON projects.admin = users.USERID WHERE EXISTS(SELECT 1 from projectbudgets where projectbudgets.projectId = projects.id) AND projects.id IN (?) GROUP BY projects.id',
      [arrProjectCollabId],
    );

    // console.log(fetchCollabProjects);

    //* Get array of costs
    const arrCostListCollab = fetchCollabProjects.map((item) => {
      const arrCost = item.costs.split(',').map((cost) => parseInt(cost));
      return arrCost;
    });

    //* Mapping array of cost for get a sum value
    const mappingCollabProjects = fetchCollabProjects.map((item, idx) => {
      const initiatedBudget = arrCostListCollab[idx][0];

      const sumValue = arrCostListCollab[idx].reduce((prev, current) => {
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

    // console.log(mappingCollabProjects);

    return {
      message: 'Success fetched all projects',
      data: {
        projectsOwned: mappingProjects,
        projectsCollab: mappingCollabProjects,
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
      throw new UnauthorizedException('Unathorized');
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
      throw new UnauthorizedException('Unathorized');
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

  async getProgressReport(projectId: string, @Request() req: any) {
    let getProject;
    const project = await this.projectRepository
      .query(
        'SELECT id, title, admin, totalContract, address, startDate, finishDate, DATEDIFF(finishDate, startDate) as duration, DATEDIFF(CURDATE(), startDate) as workDay, DATEDIFF(finishDate, CURDATE()) as remainingDay FROM projects WHERE id = ?',
        [parseInt(projectId)],
      )
      .then((data) => {
        getProject = data[0];
        return getProject;
      });

    const projectTask = await this.projectTaskRepository.query(
      'SELECT content, isFinished FROM tasks WHERE projectId = ?',
      [parseInt(projectId)],
    );

    const totalTask: number = projectTask.length;
    const finishedTask: number = projectTask.filter(
      (task: any) => task.isFinished === 1,
    ).length;
    // console.log(finishedTask);

    const projectSpending = await this.projectBudgetRepository.query(
      'SELECT cost FROM projectbudgets WHERE projectId = ? AND content != ?',
      [parseInt(projectId), 'Kontrak Awal'],
    );

    //* Get total spendings
    const sumSpendings = projectSpending
      .map((value: any) => value.cost)
      .reduce(
        (prevValue: number, currentValue: number) => prevValue + currentValue,
        0,
      );

    if (getProject === undefined) {
      throw new NotFoundException('Data not found');
    }

    const status =
      parseInt(getProject.duration) < parseInt(getProject.workDay)
        ? 'Finish'
        : 'On Going';

    const workDay =
      parseInt(getProject.duration) < parseInt(getProject.workDay)
        ? parseInt(getProject.duration)
        : parseInt(getProject.workDay);

    const remainingDay =
      parseInt(getProject.duration) < parseInt(getProject.workDay)
        ? 0
        : parseInt(getProject.remainingDay);

    const percentageWorkDay = Math.round((workDay / getProject.duration) * 100);

    const percentageTotalSpending =
      (sumSpendings / getProject.totalContract) * 100;

    const percentageTask = Math.round((finishedTask / totalTask) * 100);

    const objValue = {
      message: 'Fetch project report successfully',
      project: {
        id: getProject.id,
        title: getProject.title,
        address: getProject.address,
        start: getProject.startDate,
        finish: getProject.finishDate,
        duration: parseInt(getProject.duration),
        status,
      },
      reports: {
        workDay,
        remainingDay,
        totalBudget: getProject.totalContract,
        totalSpending: sumSpendings,
        remainingBudget: getProject.totalContract - sumSpendings,
        totalTask,
        finishedTask,
      },
      percentages: {
        workDay: percentageWorkDay,
        remainingDay: Math.round((remainingDay / getProject.duration) * 100),
        totalSpending: percentageTotalSpending,
        remainingBudget:
          ((getProject.totalContract - sumSpendings) /
            getProject.totalContract) *
          100,
        task: percentageTask,
        total:
          (percentageWorkDay + percentageTotalSpending + percentageTask) / 3,
      },
    };

    return objValue;
  }
}
