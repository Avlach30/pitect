import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Projects } from '../project.entity';
import { ProjectMembers } from './project-member.entity';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMembers)
    private projectMemberRepository: Repository<ProjectMembers>,
    @InjectRepository(Projects)
    private projectRepository: Repository<Projects>,
  ) {}

  async addCollaborator(
    @Request() req: any,
    projectId: string,
    userId: string,
  ) {
    //* Get project admin/owner firstly
    let getSingleProjectResult;

    const project = await this.projectRepository
      .query(
        'SELECT projects.id as id, projects.title as title, users.FULLNAME as admin, projects.admin as adminId, projects.address as address FROM projects INNER JOIN users ON projects.admin = users.USERID WHERE projects.id = ?',
        [parseInt(projectId)],
      )
      .then((data) => {
        getSingleProjectResult = data[0];
        return getSingleProjectResult;
      });

    if (getSingleProjectResult == undefined) {
      throw new NotFoundException('Project not found');
    }

    if (!userId) {
      throw new BadRequestException('Please input all fields');
    }

    //* Check if project admin is cannot logged user
    if (getSingleProjectResult.adminId != req.user.userId) {
      throw new ForbiddenException('Unpermission to access');
    }

    if (userId === req.user.userId) {
      throw new BadRequestException('Logged user already added');
    }

    //* Check if collaborated user already added
    const findProjectCollaboratorId = await this.projectMemberRepository.query(
      'SELECT user as userId FROM projectmembers WHERE project = ?',
      [parseInt(projectId)],
    );

    const checkAlreadyExist = findProjectCollaboratorId.findIndex(
      (value) => value.userId === parseInt(userId),
    );

    if (checkAlreadyExist > 0) {
      throw new BadRequestException('User already added');
    }

    const addNewCollaborator = await this.projectMemberRepository.query(
      'INSERT INTO projectmembers (user, project) VALUES (?, ?)',
      [parseInt(userId), parseInt(projectId)],
    );

    const objResult = {
      message: 'Add new projects collaborator successfully',
      affectedData: {
        projectId: parseInt(projectId),
        userId: parseInt(userId),
      },
    };

    return objResult;
  }

  async deleteCollaborator(
    @Request() req: any,
    projectId: string,
    userId: string,
  ) {
    //* Get project admin/owner firstly
    let getSingleProjectResult;

    const project = await this.projectRepository
      .query(
        'SELECT projects.id as id, projects.title as title, users.FULLNAME as admin, projects.admin as adminId, projects.address as address FROM projects INNER JOIN users ON projects.admin = users.USERID WHERE projects.id = ?',
        [parseInt(projectId)],
      )
      .then((data) => {
        getSingleProjectResult = data[0];
        return getSingleProjectResult;
      });

    if (getSingleProjectResult == undefined) {
      throw new NotFoundException('Project not found');
    }

    //* Check if project admin is cannot logged user
    if (getSingleProjectResult.adminId != req.user.userId) {
      throw new ForbiddenException('Unpermission to access');
    }

    //* Check if collaborated userId exist or not in project
    let getSingleCollaboratorResult;
    const getCollaboratorId = await this.projectMemberRepository
      .query(
        'SELECT user as userId FROM projectmembers WHERE project = ? AND user = ?',
        [parseInt(projectId), parseInt(userId)],
      )
      .then((data) => {
        getSingleCollaboratorResult = data[0];
        return getSingleCollaboratorResult;
      });

    if (getSingleCollaboratorResult === undefined) {
      throw new NotFoundException('Collaborator id not found');
    }

    if (getSingleCollaboratorResult.userId === parseInt(req.user.userId)) {
      throw new BadRequestException(
        'Cannot delete collaborator from logged user',
      );
    }

    const deleteCollaborator = await this.projectMemberRepository.query(
      'DELETE FROM projectmembers WHERE project = ? and user = ?',
      [parseInt(projectId), parseInt(userId)],
    );

    const objResult = {
      message: "Delete project's collaborator successfully",
    };

    return objResult;
  }
}
