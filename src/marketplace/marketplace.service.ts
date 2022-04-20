import {
  Injectable,
  BadRequestException,
  Request,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

import { Services } from '../entity/services.entity';
import { ServiceInfos } from '../entity/services.info.entity';
import { ServiceOwns } from '../entity/services.own.entity';
import { Wishlists } from '../entity/wishlist.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Services) private serviceRepository: Repository<Services>,
    @InjectRepository(ServiceInfos)
    private serviceInfoRepository: Repository<Services>,
    @InjectRepository(ServiceOwns)
    private serviceOwnRepository: Repository<ServiceOwns>,
    @InjectRepository(Wishlists)
    private wishlistRepository: Repository<Wishlists>,
    private configService: ConfigService,
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
      'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID',
    );

    //* Get all catalogs from logged user
    const getUserCatalogs = await this.serviceRepository.query(
      'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.creator = ?',
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

  async filteredCatalogs(
    search: string,
    category: string,
    minPrice: number,
    maxPrice: number,
  ) {
    let filteredResult;

    //* If search, category, min and max price isn't empty
    if (search && category && minPrice && maxPrice) {
      if (minPrice > maxPrice) {
        throw new BadRequestException(
          'Sorry, filter input for minimum price must smaller than maximum price',
        );
      }

      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.category = ? AND services.cost BETWEEN ? AND ?',
        [search.length, search, search.length, category, minPrice, maxPrice],
      );

      return filteredResult;
    }

    //* If search, category, and min price value isn't empty
    if (search && category && minPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.category = ? AND services.cost >= ?',
        [search.length, search, search.length, category, minPrice],
      );

      return filteredResult;
    }

    //* If search, category, and max price value isn't empty
    if (search && category && maxPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.category = ? AND services.cost <= ?',
        [search.length, search, search.length, category, maxPrice],
      );

      return filteredResult;
    }

    //* If search, min, and max price value isn't empty
    if (search && minPrice && maxPrice) {
      if (minPrice > maxPrice) {
        throw new BadRequestException(
          'Sorry, filter input for minimum price must smaller than maximum price',
        );
      }

      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.cost BETWEEN ? AND ?',
        [search.length, search, search.length, minPrice, maxPrice],
      );

      return filteredResult;
    }

    //* If only search and min price value isn't empty
    if (search && minPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.cost >= ?',
        [search.length, search, search.length, minPrice],
      );

      return filteredResult;
    }

    //* If only search and max price value isn't empty
    if (search && maxPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.cost <= ?',
        [search.length, search, search.length, maxPrice],
      );

      return filteredResult;
    }

    //* If category, min, and max price value isn't empty
    if (category && minPrice && maxPrice) {
      if (minPrice > maxPrice) {
        throw new BadRequestException(
          'Sorry, filter input for minimum price must smaller than maximum price',
        );
      }

      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.category = ? AND services.cost BETWEEN ? AND ?',
        [category, minPrice, maxPrice],
      );

      return filteredResult;
    }

    //* If only category and min price value isn't empty
    if (category && minPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.category = ? AND services.cost >= ?',
        [category, minPrice],
      );

      return filteredResult;
    }

    //* If only category and max price value isn't empty
    if (category && maxPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.category = ? AND services.cost <= ?',
        [category, maxPrice],
      );

      return filteredResult;
    }

    //* If only price range isn't empty
    if (minPrice && maxPrice) {
      if (minPrice > maxPrice) {
        throw new BadRequestException(
          'Sorry, filter input for minimum price must smaller than maximum price',
        );
      }

      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.cost BETWEEN ? AND ?',
        [minPrice, maxPrice],
      );

      return filteredResult;
    }

    //* If only min price value isn't empty
    if (minPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.cost >= ?',
        [minPrice],
      );

      return filteredResult;
    }

    //* If only max price value isn't empty
    if (maxPrice) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.cost <= ?',
        [maxPrice],
      );

      return filteredResult;
    }

    //* If only search and category value isn't empty
    if (search && category) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?)) AND services.category = ?',
        [search.length, search, search.length, category],
      );

      return filteredResult;
    }

    //* If only search value is available
    if (search) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE SOUNDEX(SUBSTRING(services.title, 1, ?)) = SOUNDEX(SUBSTRING(?, 1, ?))',
        [search.length, search, search.length],
      );

      return filteredResult;
    }

    //* If only category value is available
    if (category) {
      filteredResult = await this.serviceRepository.query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.category = ?',
        [category],
      );

      return filteredResult;
    }

    //* If all filter input is empty
    filteredResult = await this.serviceRepository.query(
      'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID',
    );

    return filteredResult;
  }

  async getSpecifiedCatalog(catalogId: string, @Request() req: any) {
    let result;

    const catalog = await this.serviceRepository
      .query(
        'SELECT services.id, services.title, services.image, services.cost, services.category, users.FULLNAME AS owner FROM services INNER JOIN users ON services.creator = users.USERID WHERE services.id = ?',
        [parseInt(catalogId)],
      )
      .then((data) => {
        result = data[0];
        return result;
      });

    // console.log(result);

    if (result == undefined) {
      throw new NotFoundException('Data not found');
    }

    const catalogInfo = await this.serviceInfoRepository.query(
      'SELECT id, title, content, duration, cost FROM serviceinfos WHERE serviceId = ?',
      [parseInt(catalogId)],
    );

    const objResult = {
      message: 'Get single catalog successfully',
      data: {
        result,
        info: catalogInfo,
      },
    };

    return objResult;
  }

  async insertToWishlist(@Request() req: any, catalogId: number) {
    if (!catalogId) {
      throw new BadRequestException('Please, input this field');
    }

    //* Check if catalog already added in wishlist or not
    const checkAvailability = await this.wishlistRepository.query(
      'SELECT id, serviceId FROM wishlists WHERE userId = ? AND serviceId = ?',
      [parseInt(req.user.userId), catalogId],
    );
    if (checkAvailability.length > 0) {
      throw new BadRequestException('Catalog already added');
    }

    await this.wishlistRepository.query(
      'INSERT INTO wishlists (serviceId, userId) VALUES (?, ?)',
      [catalogId, parseInt(req.user.userId)],
    );

    const objResult = { message: 'Insert to wishlist successfully' };

    return objResult;
  }

  async getWishlists(@Request() req: any) {
    const wishlists: any = await this.wishlistRepository.query(
      'SELECT wishlists.id as wishlistId, wishlists.serviceId as catalogId, services.title, services.image, services.cost, services.category FROM wishlists INNER JOIN services ON wishlists.serviceId = services.id WHERE wishlists.userId = ?',
      [parseInt(req.user.userId)],
    );

    const formattedValue = wishlists.map((item) => {
      return {
        id: item.wishlistId,
        catalog: {
          id: item.catalogId,
          title: item.title,
          image: item.image,
          cost: item.cost,
          category: item.category,
        },
      };
    });

    // console.log(formattedValue);

    const objResult = {
      message: 'Get wishlists successfully',
      user: req.user.name,
      data: formattedValue,
    };

    return objResult;
  }

  async removeFromWishlist(wishlistId: string, @Request() req: any) {
    const wishlistCatalog = await this.wishlistRepository.query(
      'SELECT id, serviceId, userId FROM wishlists WHERE id = ? AND userId = ?',
      [parseInt(wishlistId), parseInt(req.user.userId)],
    );

    //* Check if wishlist catalog available or not
    if (wishlistCatalog.length == 0) {
      throw new NotFoundException('Data not found');
    }

    await this.wishlistRepository.query('DELETE FROM wishlists WHERE id = ?', [
      parseInt(wishlistId),
    ]);

    const objResult = { message: 'Catalog removed from wishlists' };
    return objResult;
  }

  async updateProduct(
    productId: string,
    @Request() req: any,
    file: any,
    title: string,
    cost: number,
    description: string,
    category: string,
    imageUrl: string,
  ) {
    if (!title || !description || !category || !cost) {
      throw new BadRequestException('Please input all fields');
    }

    let product;
    let image;

    await this.serviceRepository
      .query(
        'SELECT id, title, description, cost, category, image, creator FROM services WHERE id = ?',
        [parseInt(productId)],
      )
      .then((data) => {
        product = data[0];
        return product;
      });

    if (product === undefined) {
      throw new NotFoundException('Data not found');
    }

    if (product.creator != req.user.userId) {
      throw new ForbiddenException('Forbidden to access');
    }

    //* If client not upload image
    if (!file) {
      image = product.image;
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

      const oldimage = product.image;
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

    await this.serviceRepository.query(
      'UPDATE services SET title = ?, cost = ?, description = ?, category = ?, image = ? WHERE id = ?',
      [title, cost, description, category, image, parseInt(productId)],
    );

    return {
      message: 'Success update product data',
      data: {
        title,
        description,
        image,
      },
    };
  }
}
