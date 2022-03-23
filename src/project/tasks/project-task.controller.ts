import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProjectTaskService } from './project-task.service';

@Controller('api/projects/:projectId/task')
export class ProjectTaskController {
  constructor(private projectTaskService: ProjectTaskService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':taskId')
  @HttpCode(200)
  async getTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const getTask = await this.projectTaskService.getSingleTask(
      projectId,
      taskId,
    );
    return getTask;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  async createNewTask(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body('content') content: string,
  ) {
    const createNewTask = await this.projectTaskService.createNewTask(
      req,
      projectId,
      content,
    );
    return createNewTask;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':taskId')
  @HttpCode(200)
  async updateTask(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body('content') content: string,
  ) {
    const updateTask = await this.projectTaskService.updateTask(
      req,
      projectId,
      taskId,
      content,
    );
    return updateTask;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':taskId')
  @HttpCode(202)
  async deleteTask(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const deleteTask = await this.projectTaskService.deleteTask(
      req,
      projectId,
      taskId,
    );
    return deleteTask;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':taskId/finish')
  @HttpCode(201)
  async finishTask(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const finishTask = await this.projectTaskService.finishTask(
      req,
      projectId,
      taskId,
    );
    return finishTask;
  }
}
