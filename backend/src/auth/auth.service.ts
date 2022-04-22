import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as mongodb from 'mongodb';

import { genSalt, hash, compare } from 'bcryptjs';
import { EMAIL_NOT_CONFIRM, USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AuthGoogleDto } from './dto/authGoogle.dto';

import * as moment from 'moment';
import * as config from './../../config/config.json';
import * as emailService from './../utils/sendEmail';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
    private readonly jwtService: JwtService
  ) { }

  async createUser(dto: RegisterDto) {
    const salt = await genSalt(10);

    const user = {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
      isActive: true,
      balance: 0,
      solved: 0,
      attempted: 0
    }

    if (dto.avatar) {
      user['avatar'] = dto.avatar;
    }

    return await this.db.collection('users').insertOne(user);
  }

  async regiserUser(dto: RegisterDto) {
    const salt = await genSalt(10);

    const user = {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
      isActive: false,
      balance: 0,
      solved: 0,
      attempted: 0
    }

    if (dto.avatar) {
      user['avatar'] = dto.avatar;
    }

    const createdInfo = await this.db.collection('users').insertOne(user);
    const createdUser = await this.db.collection('users').findOne({ _id: createdInfo.insertedId })
    await this.sendConfirmation(createdUser)
  }

  async findUser(email: string) {
    console.log(`email`, email);
    return (await this.db.collection('users').aggregate([
      {
        $match: {
          email: email
        }
      }
    ]).toArray())[0];
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    if (user.isActive === false) {
      throw new UnauthorizedException(EMAIL_NOT_CONFIRM);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    console.log(`user`, user);
    return { user: user };
  }

  async login(user: any, accountCreated = false) {
    const email = user.email;
    const _id = user._id;
    const username = user.username;
    const test = user
    const payload = { email, _id, username };
    const avatar = user.avatar;
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user._id,
      username: user.username,
      balance: user.balance,
      avatar: user.avatar,
      created: accountCreated
    };
  }

  async loginByGoogleAccount(register: RegisterDto) {
    const user = await this.findUser(register.email);
    let accountCreated = false;
    if (!user) {
      await this.createUser(register);
      accountCreated = true;
    }
    return this.login(user, accountCreated);
  }

  async sendConfirmation(user: any) {
    const tokenPayload = {
      _id: user._id,
      isActive: user.isActive,
      email: user.email
    };

    const token = await this.generateToken(tokenPayload);
    const confirmLink = `http://${config.client.host}:${config.client.port}/auth/confirm?token=${token}`;

    await this.saveToken(token, user._id);
    await emailService.main(user.email, confirmLink)
  }

  private async generateToken(data): Promise<string> {
    return await this.jwtService.sign(data);
  }

  private async saveToken(token, userId) {
    await this.db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $set: { token: token } }
    );
  }

  private async verifyToken(token: string) {
    const data = JSON.parse(JSON.stringify(this.jwtService.decode(token)));
    console.log(data);
    const user = await this.findUser(data.email);
    if (user.token != token) {
      throw new BadRequestException('Confirmation error')
    }
    return user;
  }

  async confirm(token: string) {
    const user = await this.verifyToken(token);

    if (user && !user.isActive) {

      await this.db.collection('users').updateOne(
        { _id: new mongodb.ObjectId(user._id) },
        { $set: { isActive: true }, $unset: { token: 1 } }
      );

      const email = user.email;
      const _id = user._id;
      const username = user.username;
      const payload = { email, _id, username };
      return {
        access_token: await this.jwtService.signAsync(payload),
        userId: user._id,
        username: user.username,
        avatar: user.avatar
      };
    }

    throw new BadRequestException('Confirmation error')
  }

}
