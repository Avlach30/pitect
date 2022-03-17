import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Query,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Users } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async signup(
    name: string,
    type: string,
    numberPhone: string,
    email: string,
    password: string,
  ) {
    if (!name || !type || !numberPhone || !email || !password) {
      throw new BadRequestException('Please input all fields');
    }

    let isSame: any;
    try {
      isSame = await this.userRepository.query(
        'SELECT * FROM users WHERE EMAIL = ?',
        [email],
      );
      // console.log(isSame);
    } catch (error) {
      throw new BadRequestException('E-Mail already exist');
    }
    //* If email already exist
    if (isSame.length > 0) {
      throw new BadRequestException('E-Mail already exist');
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const userCreate = await this.userRepository.query(
      'INSERT INTO users (FULLNAME, TYPE, numPhone, EMAIL, PASSWORD) VALUES (?, ?, ?, ?, ?)',
      [name, type, numberPhone, email, hashedPw],
    );

    const resultData = await this.userRepository.query(
      'SELECT EMAIL, FULLNAME, TYPE, numPhone FROM users WHERE USERID = ?',
      [userCreate.insertId],
    );

    // console.log(resultData);

    const resultObj = {
      message: 'User signup successfully',
      user: {
        fullname: resultData[0].FULLNAME,
        type: resultData[0].TYPE,
        numberPhone: parseInt(`+62${Number(resultData[0].numPhone)}`),
        email: resultData[0].EMAIL,
      },
    };

    return resultObj;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Please input all fields');
    }

    let user;

    try {
      user = await this.userRepository.query(
        'SELECT * FROM users WHERE EMAIL = ?',
        [email],
      );
      if (user.length < 0) {
        throw new UnauthorizedException('Unauthorized');
      }

      //console.log(user);

      const isCorrect = await bcrypt.compare(password, user[0].PASSWORD);
      if (!isCorrect) {
        throw new UnauthorizedException('Unauthorized');
      }
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    const loadUser = user[0];

    const token = this.jwtService.sign({
      email: loadUser.EMAIL,
      userId: loadUser.USERID.toString(),
    });

    const result = {
      message: 'Login successfully',
      token,
    };
    return result;
  }

  //* Search user with request query
  async searchUser(@Query('name') name: string, @Request() req: any) {
    //* Logic for search user, exclude logged in user
    const users = await this.userRepository.query(
      'SELECT USERID, FULLNAME, EMAIL FROM users WHERE SOUNDEX(substring(FULLNAME, 1, ?)) = SOUNDEX(substring(?, 1, ?)) AND USERID != ?',
      [name.length, name, name.length, parseInt(req.user.userId)],
    );

    // console.log(users);
    return users;
  }
}
