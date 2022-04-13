import { Injectable, BadRequestException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Services } from '../entity/services.entity';
import { ServiceInfos } from '../entity/services.info.entity';
import { ServiceOwns } from 'src/entity/services.own.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Services) private serviceRepository: Repository<Services>,
    @InjectRepository(ServiceInfos)
    private serviceInfoRepository: Repository<Services>,
    @InjectRepository(ServiceOwns)
    private serviceOwnRepository: Repository<ServiceOwns>,
  ) {}

  async createProduct(
    @Request() req: any,
    file: any,
    title: string,
    cost: number,
    description: string,
    category: string,
  ) {
    if (!file) {
      throw new BadRequestException('Please, upload an image');
    }

    if (!title || !description || !category || !cost) {
      throw new BadRequestException('Please input all fields');
    }

    const imageUrl = file.Location;

    const insertMainData = await this.serviceRepository.query(
      'INSERT INTO services (title, description, cost, category, image, creator) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, cost, category, imageUrl, parseInt(req.user.userId)],
    );

    await this.serviceOwnRepository.query(
      'INSERT INTO serviceowns (serviceId, userId, ownStatus) VALUES (?, ?, ?)',
      [insertMainData.insertId, parseInt(req.user.userId), 'Creator'],
    );

    await this.serviceRepository.query(
      'UPDATE services SET isService = ? WHERE id = ?',
      [0, insertMainData.insertId],
    );

    const objResult = {
      Message: 'Insert new product successfully',
      data: {
        title: title,
        category: category,
        isProduct: true,
        image: imageUrl,
      },
    };

    return objResult;
  }

  async createService(
    @Request() req: any,
    file: any,
    title: string,
    cost: number,
    description: string,
    category: string,
    infotitle1: string,
    infoContent1: string,
    infoDuration1: number,
    infoCost1: number,
    infotitle2: string,
    infoContent2: string,
    infoDuration2: number,
    infoCost2: number,
    infotitle3: string,
    infoContent3: string,
    infoDuration3: number,
    infoCost3: number,
  ) {
    if (!file) {
      throw new BadRequestException('Please, upload an image');
    }

    //* Main input not filled
    if (
      !title ||
      !description ||
      !category ||
      !cost ||
      !infotitle1 ||
      !infoContent1 ||
      !infoCost1 ||
      !infoDuration1 ||
      !infotitle2 ||
      !infoContent2 ||
      !infoCost2 ||
      !infoDuration2 ||
      !infotitle3 ||
      !infoContent3 ||
      !infoCost3 ||
      !infoDuration3
    ) {
      throw new BadRequestException('Please input all fields');
    }

    const imageUrl = file.Location;

    const insertMainData = await this.serviceRepository.query(
      'INSERT INTO services (title, description, cost, category, image, creator) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, cost, category, imageUrl, parseInt(req.user.userId)],
    );

    await this.serviceOwnRepository.query(
      'INSERT INTO serviceowns (serviceId, userId, ownStatus) VALUES (?, ?, ?)',
      [insertMainData.insertId, parseInt(req.user.userId), 'Creator'],
    );

    await this.serviceInfoRepository.query(
      'INSERT INTO serviceinfos (title, content, duration, cost, serviceId) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
      [
        infotitle1,
        infoContent1,
        infoDuration1,
        infoCost1,
        insertMainData.insertId,
        infotitle2,
        infoContent2,
        infoDuration2,
        infoCost2,
        insertMainData.insertId,
        infotitle3,
        infoContent3,
        infoDuration3,
        infoCost3,
        insertMainData.insertId,
      ],
    );

    const objResult = {
      Message: 'Insert new service successfully',
      data: {
        title: title,
        category: category,
        isProduct: false,
        image: imageUrl,
      },
    };

    return objResult;
  }

  async getMarketplaceCatalogs(@Request() req: any) {
    //* Get all catalogs from all users
    const getCatalogs = await this.serviceRepository.query(
      'SELECT services.id, services.title, services.cost, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID',
    );

    //* Get all catalogs from logged user
    const getUserCatalogs = await this.serviceRepository.query(
      'SELECT services.id, services.title, services.cost, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.creator = ?',
      [parseInt(req.user.userId)],
    );

    const objResult = {
      message: 'Get all marketplace catalogs successfully',
      data: {
        allCatalogs: getCatalogs,
        userCatalogs: getUserCatalogs,
      },
      metaInfo: {
        totalCatalogs: getCatalogs.length,
        totalUserCatalogs: getUserCatalogs.length,
      },
    };

    return objResult;
  }
}
