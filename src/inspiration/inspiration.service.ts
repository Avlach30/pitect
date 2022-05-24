import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inspirations } from '../entity/inspiration.entity';

@Injectable()
export class InspirationService {
  constructor(
    @InjectRepository(Inspirations)
    private inspirationRepository: Repository<Inspirations>,
  ) {}

  async getInspirations(req: any) {
    const inspirations = await this.inspirationRepository.query(
      'SELECT inspirations.id, inspirations.title, inspirations.imageUrl, inspirations.description, users.FULLNAME as creator FROM inspirations INNER JOIN users ON inspirations.creator = users.USERID',
    );

    const userInspirations = await this.inspirationRepository.query(
      'SELECT inspirations.id, inspirations.title, inspirations.imageUrl, inspirations.description, users.FULLNAME as creator FROM inspirations INNER JOIN users ON inspirations.creator = users.USERID WHERE inspirations.creator = ?',
      [parseInt(req.user.userId)],
    );

    const objResult = {
      message: 'Get all inspirations successfully',
      inspirations: inspirations,
      userInspirations: userInspirations,
      total: {
        inspirations: inspirations.length,
        userInspirations: userInspirations.length,
      },
    };

    return objResult;
  }

  async createInspiration(req, title, description, file) {
    if (!file) {
      throw new BadRequestException('Please, upload an image');
    }

    if (!title || !description) {
      throw new BadRequestException('Sorry, all input field must required');
    }

    const imageUrl = file.Location;

    await this.inspirationRepository.query(
      'INSERT INTO inspirations (title, imageUrl, creator, description) VALUES (?, ?, ?, ?)',
      [title, imageUrl, parseInt(req.user.userId), description],
    );

    const objResult = {
      message: 'Create new inspiration successfully',
      data: {
        title: title,
        image: imageUrl,
      },
    };

    return objResult;
  }
}
