import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserProfileDto } from './dto/update-user.dto';
import * as mongodb from 'mongodb';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
    private readonly jwtService: JwtService
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
