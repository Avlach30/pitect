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

  async signup(name: string, type: string, email: string, password: string) {
    let isSame;
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
      'INSERT INTO users (FULLNAME, TYPE, EMAIL, PASSWORD) VALUES (?, ?, ?, ?)',
      [name, type, email, hashedPw],
    );

    const resultData = await this.userRepository.query(
      'SELECT EMAIL, FULLNAME, TYPE FROM users WHERE USERID = ?',
      [userCreate.insertId],
    );

    const resultObj = {
      fullname: resultData[0].FULLNAME,
      type: resultData[0].TYPE,
      email: resultData[0].EMAIL,
    };

    return resultObj;
  }

  async login(email: string, password: string) {
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
    return token;
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
