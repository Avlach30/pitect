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

import { ProjectMembers } from '../entity/project-member.entity';
import { Projects } from '../entity/project.entity';
import { ProjectBudgets } from '../entity/project-budget.entity';
import { ProjectTasks } from '../entity/project-task.entity';

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
    let fetchProjectOwnedResult;
    //* Fetching all projects with admin = id of user logged in
    const fetchProjects = await this.projectRepository
      .query(
        'SELECT projects.id as id, projects.title as name, users.FULLNAME as admin, projects.totalContract, DATEDIFF(projects.finishDate, projects.startDate) as duration, projects.address FROM projects INNER JOIN users ON projects.admin = users.USERID WHERE projects.admin = ?',
        [parseInt(req.user.userId)],
      )
      .then((data) => {
        fetchProjectOwnedResult = data;
        return fetchProjectOwnedResult;
      });

    // console.log(fetchProjectOwnedResult);

    let mappingOwnedProjects: any;

    if (fetchProjectOwnedResult.length === 0) {
      mappingOwnedProjects = fetchProjectOwnedResult;
    }

    const arrOwnedProjectsId = fetchProjectOwnedResult.map(
      (project) => project.id,
    );

    //* If projects owned available
    let fetchSpendings;
    let sumOwnedProjectSpendings = 0;
    let sumOwnedProjectContracts = 0;
    if (fetchProjectOwnedResult.length > 0) {
      //* Get array of project spendings
      fetchSpendings = await this.projectBudgetRepository.query(
        'SELECT projectId as id, cost FROM projectbudgets WHERE projectId IN (?) AND content != ?',
        [arrOwnedProjectsId, 'Kontrak Awal'],
      );

      //* Get array of project spendings
      const arrSpendings = fetchSpendings.reduce((elem, value) => {
        if (elem[value.id]) {
          elem[value.id].cost = [elem[value.id].cost, value.cost].reduce(
            (prevValue, currentValue) => prevValue + currentValue,
            0,
          );
        } else {
          elem[value.id] = value;
        }

        return elem;
      }, {});

      const formattedArrSpendings = Object.values(arrSpendings);

      // console.log(formattedArrSpendings);

      mappingOwnedProjects = fetchProjectOwnedResult.map((value) => ({
        ...value,
        ...fetchSpendings.find((id) => id.id === value.id),
      }));

      mappingOwnedProjects.map((value) => {
        value.duration = parseInt(value.duration);

        if (value.cost === undefined) {
          value.cost = 0;
        }

        return value;
      });

      //* Mapping array untuk mendapatkan data total kontrak, dan total pengeluaran
      sumOwnedProjectContracts = mappingOwnedProjects
        .map((contract) => contract.totalContract)
        .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

      sumOwnedProjectSpendings = mappingOwnedProjects
        .map((contract) => contract.cost)
        .reduce((prevValue, currentValue) => prevValue + currentValue, 0);
    }

    //* Fething all project with collaborator of user logged in
    const fetchCollabProjectId = await this.projectRepository.query(
      'SELECT projectmembers.project FROM projectmembers INNER JOIN projects ON projectmembers.project = projects.id WHERE projectmembers.user = ? AND projects.admin != ?',
      [parseInt(req.user.userId), parseInt(req.user.userId)],
    );

    const arrProjectCollabId = fetchCollabProjectId.map(
      (value) => value.project,
    );

    let mappingCollabProjects;
    let fetchProjectCollabSpendings;
    let sumCollabProjectSpending = 0;
    let sumCollabProjectContract = 0;

    //* Check if project collaboration is available or not
    if (arrProjectCollabId.length === 0) {
      mappingCollabProjects = [];
    } else {
      const fetchCollabProjects = await this.projectRepository.query(
        'SELECT projects.id as id, projects.title as name, users.FULLNAME as admin, projects.totalContract, DATEDIFF(projects.finishDate, projects.startDate) as duration, projects.address FROM projects INNER JOIN users ON projects.admin = users.USERID WHERE projects.id IN (?)',
        [arrProjectCollabId],
      );

      fetchProjectCollabSpendings = await this.projectBudgetRepository.query(
        'SELECT projectId as id, cost FROM projectbudgets WHERE projectId IN (?) AND content != ?',
        [arrProjectCollabId, 'Kontrak Awal'],
      );

      // console.log(fetchProjectCollabSpendings);

      //* Get array of project collab spendings
      const arrSpendings = fetchProjectCollabSpendings.reduce((elem, value) => {
        if (elem[value.id]) {
          elem[value.id].cost = [elem[value.id].cost, value.cost].reduce(
            (prevValue, currentValue) => prevValue + currentValue,
            0,
          );
        } else {
          elem[value.id] = value;
        }

        return elem;
      }, {});

      const formattedArrSpendings = Object.values(arrSpendings);

      // console.log(formattedArrSpendings);

      mappingCollabProjects = fetchCollabProjects.map((value) => ({
        ...value,
        ...fetchProjectCollabSpendings.find((id) => id.id === value.id),
      }));

      mappingCollabProjects.map((value) => {
        value.duration = parseInt(value.duration);

        if (value.cost === undefined) {
          value.cost = 0;
        }

        return value;
      });

      //* Mapping array untuk mendapatkan data total kontrak, dan total pengeluaran
      sumCollabProjectContract = mappingCollabProjects
        .map((contract) => contract.totalContract)
        .reduce((prevValue, currentValue) => prevValue + currentValue, 0);

      sumCollabProjectSpending = mappingCollabProjects
        .map((contract) => contract.cost)
        .reduce((prevValue, currentValue) => prevValue + currentValue, 0);
    }

    // console.log(resultCollabProjects);

    const sumContracts = sumOwnedProjectContracts + sumCollabProjectContract;
    const sumSpendings = sumOwnedProjectSpendings + sumCollabProjectSpending;
    const remainingBudget = sumContracts - sumSpendings;

    const result = {
      message: 'Success fetched all projects',
      data: {
        projectsOwned: mappingOwnedProjects,
        projectsCollab: mappingCollabProjects,
        budgets: {
          sumContracts,
          sumSpendings,
          remainingBudget,
        },
        percentageBudgets: {
          spending: (sumSpendings / sumContracts) * 100 || 0,
          remainBudget: (remainingBudget / sumContracts) * 100 || 0,
        },
      },
    };

    return result;
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
        total: (percentageWorkDay + percentageTotalSpending) / 2,
      },
    };

    return objValue;
  }
}
