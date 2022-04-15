import { Inject, Injectable } from '@nestjs/common';

import * as mongodb from 'mongodb';

@Injectable()
export class LeaderboardService {

  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
  ) { }
  async findAll(contestId:string) {
    return await this.db.collection('submission').aggregate([
      {
        $match: { contestId: contestId }
      }
    ]).toArray();

  }

  findOne(id: number) {
    return `This action returns a #${id} leaderboard`;
  }

}
