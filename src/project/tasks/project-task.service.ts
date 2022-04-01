import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectTasks } from './project-task.entity';
import { Projects } from '../project.entity';
import { ProjectMembers } from '../members/project-member.entity';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(ProjectTasks)
    private projectTaskRepository: Repository<ProjectTasks>,
    @InjectRepository(Projects) private projectRepository: Repository<Projects>,
    @InjectRepository(ProjectMembers)
    private projectMemberRepository: Repository<ProjectMembers>,
  ) {}

  async getSingleTask(projectId: string, taskId: string) {
    const task = await this.projectTaskRepository.query(
      'SELECT id, content, isFinished, projectId FROM tasks WHERE id = ? AND projectId = ?',
      [parseInt(taskId), parseInt(projectId)],
    );

    if (task.length < 1) {
      throw new NotFoundException('Data not found');
    }

    const objResult = {
      message: 'Fetch single task successfully',
      data: task[0],
    };

    return objResult;
  }

  async createNewTask(@Request() req: any, projectId: string, content: string) {
    if (!content) {
      throw new BadRequestException('Please input this field');
    }

    const findProjectId = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    if (findProjectId.length < 1) {
      throw new NotFoundException('Data not found');
    }

    if (findProjectId[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const insertQuery = await this.projectTaskRepository.query(
      'INSERT INTO tasks (content, projectId) VALUES (?, ?)',
      [content, parseInt(projectId)],
    );

    const objResult = {
      message: 'Create new project task successfully',
      task: content,
    };

    return objResult;
  }

  async updateTask(
    @Request() req: any,
    projectId: string,
    taskId: string,
    content: string,
  ) {
    if (!content) {
      throw new BadRequestException('Please input this field');
    }

    const task = await this.projectTaskRepository.query(
      'SELECT id, content, isFinished, projectId FROM tasks WHERE id = ? AND projectId = ?',
      [parseInt(taskId), parseInt(projectId)],
    );

    const findProjectId = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    if (task.length < 1 || findProjectId.length < 1) {
      throw new NotFoundException('Data not found');
    }

    if (findProjectId[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const updateQuery = await this.projectTaskRepository.query(
      'UPDATE tasks SET content = ? WHERE id = ?',
      [content, parseInt(taskId)],
    );

    const objResult = {
      message: 'Update project task successfully',
      updatedTask: content,
    };

    return objResult;
  }

  async deleteTask(@Request() req: any, projectId: string, taskId: string) {
    const task = await this.projectTaskRepository.query(
      'SELECT id, content, isFinished, projectId FROM tasks WHERE id = ? AND projectId = ?',
      [parseInt(taskId), parseInt(projectId)],
    );

    const findProjectId = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    if (task.length < 1 || findProjectId.length < 1) {
      throw new NotFoundException('Data not found');
    }

    if (findProjectId[0].admin != parseInt(req.user.userId)) {
      throw new ForbiddenException('Unpermission to access');
    }

    const deleteQuery = await this.projectTaskRepository.query(
      'DELETE FROM tasks WHERE id = ?',
      [parseInt(taskId)],
    );

    const objResult = {
      message: 'Delete project task successfully',
    };

    return objResult;
  }

  async finishTask(@Request() req: any, projectId: string, taskId: string) {
    const task = await this.projectTaskRepository.query(
      'SELECT id, content, isFinished, projectId FROM tasks WHERE id = ? AND projectId = ?',
      [parseInt(taskId), parseInt(projectId)],
    );

    const findProjectId = await this.projectRepository.query(
      'SELECT id, admin FROM projects WHERE id = ?',
      [parseInt(projectId)],
    );

    if (task.length < 1 || findProjectId.length < 1) {
      throw new NotFoundException('Data not found');
    }

    //* Get array of id's collaborator
    const getCollaborator = await this.projectMemberRepository.query(
      'SELECT user FROM projectmembers WHERE project = ?',
      [parseInt(projectId)],
    );

    const arrIdCollaborator = getCollaborator.map((value) => value.user);

    //* Check logged user id include in array or not
    const checkInclude = arrIdCollaborator.findIndex(
      (value) => value === parseInt(req.user.userId),
    );
    if (checkInclude < 0) {
      throw new ForbiddenException('Unpermission to access');
    }

    const finishTask = await this.projectTaskRepository.query(
      'UPDATE tasks SET isFinished = 1 WHERE id = ?',
      [parseInt(taskId)],
    );

    const objResult = {
      message: 'Task finished',
      finishedTask: task[0].content,
      finishedBy: req.user.email,
    };

    return objResult;
  }
}
