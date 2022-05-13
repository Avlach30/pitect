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

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Projects) private projectRepository: Repository<Projects>,
    @InjectRepository(Orders) private orderRepository: Repository<Orders>,
  ) {}

  async getDashboards() {
    const getAllProjects = await this.projectRepository.query(
      'SELECT projects.id, projects.title, users.FULLNAME as admin, projects.totalContract, projects.address, projects.startDate, projects.finishDate, DATEDIFF(projects.finishDate, projects.startDate) as duration FROM projects INNER JOIN users ON projects.admin = users.USERID',
    );

    const getAllUsers = await this.userRepository.query(
      'SELECT USERID as id, FULLNAME as name, TYPE as type, isVerified, numPhone, EMAIL as email FROM users',
    );

    //* Count verified users
    const countVerifiedUser = getAllUsers.filter((user: any) => {
      return user.isVerified === 1;
    }).length;

    //* Convert project duration to integer
    getAllProjects.map((project: any) => {
      project.duration = parseInt(project.duration);

      return project;
    });

    const objResult = {
      message: 'Fetching all project and user successfully',
      projects: {
        data: getAllProjects,
        total: getAllProjects.length,
      },
      users: {
        data: getAllUsers,
        total: getAllUsers.length,
        information: {
          verified: countVerifiedUser,
          unVerified: getAllUsers.length - countVerifiedUser,
        },
      },
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
    };

    return objResult;
  }

  async confirmOrder(id: string) {
    let order;
    await this.orderRepository
      .query('SELECT id, cost, slipPayment FROM orders WHERE id = ?', [
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
}
