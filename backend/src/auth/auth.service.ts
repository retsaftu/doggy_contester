import { Injectable, Inject } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as mongodb from 'mongodb';

import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
    private readonly jwtService: JwtService
  ) { }
  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);

    return await this.db.collection('users').insertOne(
      {
        email: dto.login,
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

}
