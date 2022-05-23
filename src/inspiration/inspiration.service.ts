import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inspirations } from 'src/entity/inspiration.entity';

@Injectable()
export class InspirationService {
  constructor(
    @InjectRepository(Inspirations)
    private inspirationRepository: Repository<Inspirations>,
  ) {}

  async getInspirations(req: any) {
    const inspirations = await this.inspirationRepository.query(
      'SELECT inspirations.id, inspirations.title, inspirations.description, users.FULLNAME as creator FROM inspirations INNER JOIN users ON inspirations.creator = users.USERID',
    );

    const userInspirations = await this.inspirationRepository.query(
      'SELECT inspirations.id, inspirations.title, inspirations.description, users.FULLNAME FROM inspirations INNER JOIN users ON inspirations.creator = users.USERID WHERE inspirations.creator = ?',
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
}
