import {
  Controller,
  Body,
  Post,
  Param,
  Request,
  UseGuards,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProjectMemberService } from './project-member.service';

@Controller('api/projects/:projectId')
export class ProjectMemberController {
  constructor(private projectMemberService: ProjectMemberService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  async addCollaborator(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Body('userId') userId: string,
  ) {
    const addCollaborator = await this.projectMemberService.addCollaborator(
      req,
      projectId,
      userId,
    );

    return addCollaborator;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('members/:userId')
  @HttpCode(201)
  async removeCollaborator(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    const removeCollaborator =
      await this.projectMemberService.deleteCollaborator(
        req,
        projectId,
        userId,
      );

    return removeCollaborator;
  }
}
