import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';

import { Inspirations } from '../entity/inspiration.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InspirationService {
  constructor(
    @InjectRepository(Inspirations)
    private inspirationRepository: Repository<Inspirations>,
    private configService: ConfigService,
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

  async getDetailInspiration(inspirationId: string) {
    let inspiration: any;

    await this.inspirationRepository
      .query(
        'SELECT inspirations.id, inspirations.title, inspirations.imageUrl, inspirations.description, users.FULLNAME as creator, users.facebookId, users.instagramId FROM inspirations INNER JOIN users ON inspirations.creator = users.USERID WHERE inspirations.id = ?',
        [parseInt(inspirationId)],
      )
      .then((data) => {
        inspiration = data[0];
        return inspiration;
      });

    if (inspiration == undefined) {
      throw new NotFoundException('Data not found');
    }

    const objResult = {
      message: 'Get single inspiration successfully',
      data: inspiration,
    };

    return objResult;
  }

  async updateInspiration(
    inspirationId: string,
    req: any,
    title: string,
    description: string,
    file: any,
  ) {
    let inspiration: any;
    let image: any;

    await this.inspirationRepository
      .query(
        'SELECT id, title, imageUrl, description, creator FROM inspirations WHERE inspirations.id = ?',
        [parseInt(inspirationId)],
      )
      .then((data) => {
        inspiration = data[0];
        return inspiration;
      });

    if (inspiration == undefined) {
      throw new NotFoundException('Data not found');
    }

    if (inspiration.creator != parseInt(req.user.userId)) {
      throw new ForbiddenException('Forbidden to access');
    }

    if (!file) {
      image = inspiration.imageUrl;
    }

    if (file) {
      //* Config s3 for remove existing object in s3 bucket
      const s3 = new AWS.S3({
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_S3_ACESS_KEY'),
          secretAccessKey: this.configService.get<string>(
            'AWS_S3_SECRET_ACCESS_KEY',
          ),
        },
        region: this.configService.get<string>('AWS_S3_BUCKET_REGION'),
      });

      const oldimage = inspiration.imageUrl;
      const oldImageKey = new URL(oldimage).pathname.replace(/^\//g, '');

      s3.deleteObject(
        {
          Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
          Key: oldImageKey,
        },
        (error, data) => {
          if (error) {
            return error;
          }

          return 'Deleted existing object in S3 successfully';
        },
      );

      image = file.Location;
    }

    await this.inspirationRepository.query(
      'UPDATE inspirations SET title = ?, imageUrl = ?, description = ? WHERE id = ?',
      [title, image, description, parseInt(inspirationId)],
    );

    const objResult = {
      message: 'Update inspiration successfully',
      affectedId: inspiration.id,
    };

    return objResult;
  }
}
