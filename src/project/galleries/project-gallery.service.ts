import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectGalleries } from '../../entity/project-gallery.entity';
import { Projects } from '../../entity/project.entity';
import { ProjectMembers } from '../../entity/project-member.entity';

@Injectable()
export class ProjectGalleryService {
  constructor(
    @InjectRepository(ProjectGalleries)
    private projectGalleryRepository: Repository<ProjectGalleries>,
    @InjectRepository(Projects)
    private projectRepository: Repository<Projects>,
    @InjectRepository(ProjectMembers)
    private projectMemberRepository: Repository<ProjectMembers>,
  ) {}

  async createProjectGallery(
    projectId: string,
    req: any,
    file: any,
    description: string,
    date: string,
  ) {
    let project;
    let member;

    if (!file || !description || !date) {
      throw new BadRequestException(
        'Please, input all fields include upload an image file',
      );
    }

    await this.projectRepository
      .query('SELECT id FROM projects WHERE id = ?', [parseInt(projectId)])
      .then((data) => (project = data[0]));

    if (project == undefined) {
      throw new NotFoundException('Data not found');
    }

    await this.projectMemberRepository
      .query(
        'SELECT id, user FROM projectmembers WHERE project = ? AND user = ?',
        [parseInt(projectId), parseInt(req.user.userId)],
      )
      .then((data) => (member = data[0]));

    if (member == undefined)
      throw new ForbiddenException('Forbidden to access');

    const imageUrl = file.Location;

    const formattedDate = new Date(Date.parse(date));

    await this.projectGalleryRepository.query(
      'INSERT INTO projectgalleries (description, date, imageUrl, userId, projectId) VALUES (?, ?, ?, ?, ?)',
      [
        description,
        formattedDate,
        imageUrl,
        parseInt(req.user.userId),
        parseInt(projectId),
      ],
    );

    const objResult = {
      message: 'Create new documentation for construction project successfully',
      image: imageUrl,
    };

    return objResult;
  }
}
