import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as mongodb from 'mongodb';

import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { AuthGoogleDto } from './dto/authGoogle.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
    private readonly jwtService: JwtService
  ) { }
  async createUser(dto: RegisterDto) {
    const salt = await genSalt(10);

    return await this.db.collection('users').insertOne(
      {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        passwordHash: await hash(dto.password, salt)
      }
    );
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
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    console.log(`user`, user);
    return { user: user };
  }

  async login(user: any) {
    const email = user.email;
    const _id = user._id;
    const username = user.username;
    const test = user
    const payload = { email, _id, username };
    const avatar = user.avatar;
    console.log(`email`, email);
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user._id,
      username: user.username,
      avatar: user.avatar
    };
  }

}
