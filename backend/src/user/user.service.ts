import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto, UpdateUserProfileDto } from './dto/update-user.dto';
import * as mongodb from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from 'src/auth/auth.constants';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
    private readonly jwtService: JwtService,
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(_id: string) {
    console.log(`_id`, _id);
    return (await this.db.collection('users').aggregate([
      {
        $match: {
          _id: new mongodb.ObjectId(_id)
        }
      }
    ]).toArray())[0];
  }

  async deleteAvatar(userId: string) {
    return (await this.db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $unset: { avatar: 1 } }
    ))
  }

  async updateUserProfile(userId: string, userProfile: any) {
    console.log(userProfile);
    return (await this.db.collection('users').findOneAndUpdate(
      {_id: new mongodb.ObjectId(userId) },
      { $set: userProfile }
    ))
  }

  async validateUser(_id: string, password: string) {
    const user = await this.findOne(_id);
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

  async changePassword(userId: string, changePassword: ChangePasswordDto) {
    const user = await this.validateUser(userId, changePassword.oldPassword);
    const salt = await genSalt(10);
    console.log(user)
    return (await this.db.collection('users').findOneAndUpdate(
      {_id: new mongodb.ObjectId(userId)},
      { $set: {
          passwordHash: await hash(changePassword.newPassword, salt)
        }
      }
    ))
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
