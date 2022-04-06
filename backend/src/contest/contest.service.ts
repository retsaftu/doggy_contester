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
    console.log(`createContestDto`, createContestDto);
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

  async findMyContest(myid: string) {
    return (await this.db.collection('contest').aggregate([
      {
        $match: {
          "owner._id": myid
        }
      }
    ]).toArray());
  }

  async findMyActiveContest(myid: string) {
    return (await this.db.collection('contest').aggregate([
      // {
      //   $match: {
      //     participants: { "$in": [{myid}] }
      //   }
      // }
      {
        $unwind: "$participants"
      },
      {
        $match: {
          'participants._id': new mongodb.ObjectId(myid),
          endDate: {
            // $gte: new Date("2013-01-01T00:00:00.0Z"),
            $lt: new Date()
          }
        }
      }
    ]).toArray());
  }

  async findCurrentContests(myid: string) {
    return (await this.db.collection('contest').aggregate([
      // {
      //   $match: {
      //     participants: { "$in": [{myid}] }
      //   }
      // }
      {
        $unwind: "$participants"
      },
      {
        $match: {
          'participants._id': {
            $ne: new mongodb.ObjectId(myid)
          },
          endDate: {
            // $gte: new Date("2013-01-01T00:00:00.0Z"),
            $lt: new Date()
          }
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
