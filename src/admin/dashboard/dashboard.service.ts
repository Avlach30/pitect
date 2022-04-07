import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../entity/user.entity';
import { Projects } from '../../entity/project.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Projects) private projectRepository: Repository<Projects>,
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
}
