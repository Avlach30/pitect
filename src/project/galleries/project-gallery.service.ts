import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectGalleries } from '../../entity/project-gallery.entity';

@Injectable()
export class ProjectGalleryService {
  constructor(
    @InjectRepository(ProjectGalleries)
    private serviceRepository: Repository<ProjectGalleries>,
  ) {}
}
