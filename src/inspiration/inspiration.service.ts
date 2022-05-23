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

  async getInspirations() {
    return null;
  }
}
