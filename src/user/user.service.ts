import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Users } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
    private configService: ConfigService,
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

    const token = this.jwtService.sign(
      {
        email: loadUser.EMAIL,
        userId: loadUser.USERID.toString(),
        name: loadUser.FULLNAME,
      },
      {
        expiresIn: '4h',
        secret: this.configService.get<string>('JWT_SERVICE'),
      },
    );

    const result = {
      message: 'Login successfully',
      token,
    };
    return result;
  }

  //* Search user
  async searchUser(name: string, @Request() req: any) {
    if (!name) {
      throw new BadRequestException('Please input this fields');
    }

    //* Logic for search user, exclude logged in user
    const users = await this.userRepository.query(
      'SELECT USERID, FULLNAME, EMAIL FROM users WHERE SOUNDEX(substring(FULLNAME, 1, ?)) = SOUNDEX(substring(?, 1, ?)) AND USERID != ?',
      [name.length, name, name.length, parseInt(req.user.userId)],
    );

    // console.log(users);
    return users;
  }

  async getUser(@Request() req: any) {
    const user = await this.userRepository.query(
      'SELECT FULLNAME, TYPE, isVerified, numPhone, EMAIL, avatar, facebookId, instagramId FROM users WHERE USERID = ?',
      [parseInt(req.user.userId)],
    );

    const objResult = {
      message: 'Fetch user logged in successfully',
      data: {
        name: user[0].FULLNAME,
        photo: user[0].avatar,
        accountType: user[0].TYPE,
        isVerified: user[0].isVerified,
        numberPhone: parseInt(`+62${Number(user[0].numPhone)}`),
        email: user[0].EMAIL,
        facebook: user[0].facebookId,
        instagram: user[0].instagramId,
      },
    };

    return objResult;
  }

  async updateProfile(
    @Request() req: any,
    name: string,
    type: string,
    numberPhone: string,
    email: string,
    facebook: string,
    instagram: string,
  ) {
    if (!name || !type || !numberPhone || !email || !facebook || !instagram) {
      throw new BadRequestException('Please input all fields');
    }

    await this.userRepository.query(
      'UPDATE users SET FULLNAME = ?, TYPE = ?, numPhone = ?, EMAIL = ?, facebookId = ?, instagramId = ? WHERE USERID = ?',
      [
        name,
        type,
        numberPhone,
        email,
        facebook,
        instagram,
        parseInt(req.user.userId),
      ],
    );

    const objResult = {
      message: 'Update user logged in successfully',
      data: {
        facebook: facebook,
        instagram: instagram,
      },
    };

    return objResult;
  }

  async deleteProfile(@Request() req: any) {
    const deleteUser = await this.userRepository.query(
      'DELETE FROM users WHERE USERID = ?',
      [parseInt(req.user.userId)],
    );

    return {
      message: 'Delete user successfully',
    };
  }
}
