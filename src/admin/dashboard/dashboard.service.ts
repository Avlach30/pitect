import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../entity/user.entity';
import { Projects } from '../../entity/project.entity';
import { Orders } from '../../entity/order.entity';
import { Services } from '../../entity/services.entity';
import { Inspirations } from '../../entity/inspiration.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Projects) private projectRepository: Repository<Projects>,
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
    @InjectRepository(Services) private serviceRepository: Repository<Services>,
    @InjectRepository(Inspirations)
    private inspirationRepository: Repository<Inspirations>,
  ) {}

  async getDashboards() {
    const getTotalProjects = await this.projectRepository.query(
      'SELECT COUNT(*) as totalProject FROM projects',
    );

    const getTotalUsers = await this.userRepository.query(
      'SELECT COUNT(*) as totalUser FROM users',
    );

    const getTotalServices = await this.serviceRepository.query(
      'SELECT COUNT(*) as totalService FROM services',
    );

    const getTotalOrders = await this.orderRepository.query(
      'SELECT COUNT(*) as totalOrder FROM orders',
    );

    const getTotalInspiration = await this.inspirationRepository.query(
      'SELECT COUNT(*) as totalInspiration FROM inspirations',
    );

    const objResult = {
      message: 'get all total data successfully',
      total: {
        user: parseInt(getTotalUsers[0].totalUser),
        project: parseInt(getTotalProjects[0].totalProject),
        serviceCatalog: parseInt(getTotalServices[0].totalService),
        order: parseInt(getTotalOrders[0].totalOrder),
        inspiration: parseInt(getTotalInspiration[0].totalInspiration),
      },
    };

    return objResult;
  }

  async getUserDashboards() {
    const getAllUsers = await this.userRepository.query(
      'SELECT USERID as id, FULLNAME as name, TYPE as type, isVerified, numPhone, EMAIL as email FROM users',
    );

    //* Count verified users
    const countVerifiedUser = getAllUsers.filter((user: any) => {
      return user.isVerified === 1;
    }).length;

    const objResult = {
      message: 'Get all user data successfully',
      data: getAllUsers,
      total: getAllUsers.length,
      information: {
        verified: countVerifiedUser,
        unVerified: getAllUsers.length - countVerifiedUser,
      },
    };

    return objResult;
  }

  async getProjectDashboards() {
    const getAllProjects = await this.projectRepository.query(
      'SELECT projects.id, projects.title, users.FULLNAME as owner, projects.totalContract, projects.address, projects.startDate, projects.finishDate, DATEDIFF(projects.finishDate, projects.startDate) as duration FROM projects INNER JOIN users ON projects.admin = users.USERID',
    );

    //* Convert project duration to integer
    getAllProjects.map((project: any) => {
      project.duration = parseInt(project.duration);

      return project;
    });

    const objResult = {
      message: 'Get all project data successfully',
      projects: getAllProjects,
      total: getAllProjects.length,
    };

    return objResult;
  }

  async getServiceCatalogDashboards() {
    const getCatalogs = await this.serviceRepository.query(
      'SELECT services.id, services.title, users.FULLNAME as creator, services.description, services.cost, services.category, services.image FROM services INNER JOIN users ON services.creator = users.USERID',
    );

    const objResult = {
      message: 'Get all marketplace catalog data successfully',
      catalogs: getCatalogs,
      total: getCatalogs.length,
    };

    return objResult;
  }

  async getOrderDashboards() {
    const getOrders = await this.orderRepository.query(
      'SELECT orders.id, orders.date, orders.cost, orders.status, orders.cancelDate, orders.slipPayment, orders.isApprove, users.FULLNAME as buyer FROM orders INNER JOIN users on orders.userId = users.USERID',
    );

    const objResult = {
      message: 'Get all orders successfully',
      data: getOrders,
      total: getOrders.length,
    };

    return objResult;
  }

  async confirmOrder(id: string) {
    let order;
    await this.orderRepository
      .query('SELECT id, cost, status, slipPayment FROM orders WHERE id = ?', [
        parseInt(id),
      ])
      .then((data) => {
        return (order = data[0]);
      });

    // console.log(order);

    if (order == undefined) {
      throw new NotFoundException('Data not found');
    }

    if (order.status == 'Pesanan aktif') {
      throw new BadRequestException('Order already confirmed');
    }

    if (order.slipPayment == 'Some image') {
      throw new BadRequestException(
        'Please, confirm an order which is already uploaded a slip transfer',
      );
    }

    await this.orderRepository.query(
      'UPDATE orders SET status = "Pesanan aktif" WHERE id = ?',
      [parseInt(id)],
    );

    const objResult = {
      message: 'Admin verification for order successfully',
      order: {
        id: parseInt(id),
        status: 'Pesanan aktif',
      },
    };

    return objResult;
  }

  async getInspirationDashboards() {
    const getInspirations = await this.inspirationRepository.query(
      'SELECT inspirations.id, inspirations.title, users.FULLNAME as creator, inspirations.imageUrl, inspirations.description FROM inspirations INNER JOIN users ON inspirations.creator = users.USERID',
    );

    const objResult = {
      message: 'Get all inspirations successfully',
      inspirations: getInspirations,
      total: getInspirations.length,
    };

    return objResult;
  }
}
