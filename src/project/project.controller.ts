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

import { ProjectService } from './project.service';

@Controller('api/projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(200)
  async getProjects(@Request() req: any) {
    const fetchProjects = await this.projectService.fetchProjects(req);
    return fetchProjects;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  async createProject(
    @Request() req: any,
    @Body('title') title: string,
    @Body('totalContract') totalContract: number,
    @Body('startDate') startDate: string,
    @Body('finishDate') finishDate: string,
    @Body('address') address: string,
  ) {
    const newProject = await this.projectService.createProject(
      req,
      title,
      totalContract,
      startDate,
      finishDate,
      address,
    );
    return newProject;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectId')
  @HttpCode(200)
  async getProject(@Param('projectId') projectId: string, @Request() req: any) {
    const getSpecifiedProject = await this.projectService.getSpecifiedProject(
      projectId,
      req,
    );
    return getSpecifiedProject;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':projectId')
  @HttpCode(200)
  async updateProject(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @Body('title') title: string,
    @Body('address') address: string,
  ) {
    const updateProject = await this.projectService.updateProject(
      projectId,
      req,
      title,
      address,
    );
    return updateProject;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':projectId')
  @HttpCode(202)
  async deleteProject(
    @Param('projectId') projectId: string,
    @Request() req: any,
  ) {
    const deleteProject = await this.projectService.deleteProject(
      projectId,
      req,
    );
    return deleteProject;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':projectId/report')
  @HttpCode(200)
  async getProgressReport(
    @Param('projectId') projectId: string,
    @Request() req: any,
  ) {
    const getProgressReport = await this.projectService.getProgressReport(
      projectId,
      req,
    );
    return getProgressReport;
  }
}
