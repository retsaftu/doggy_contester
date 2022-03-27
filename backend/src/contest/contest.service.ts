import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import * as mongodb from 'mongodb';

@Injectable()
export class ContestService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db
  ) { }

  async create(createContestDto: CreateContestDto) {
    return await this.db.collection('contest').insertOne(createContestDto);
  }

  async findAll() {
    return (await this.db.collection('contest').aggregate([
      {
        $match: {

        }
      }
    ]).toArray());
  }

  findOne(id: number) {
    return `This action returns a #${id} contest`;
  }

  update(id: number, updateContestDto: UpdateContestDto) {
    return `This action updates a #${id} contest`;
  }

  remove(id: number) {
    return `This action removes a #${id} contest`;
  }
}
