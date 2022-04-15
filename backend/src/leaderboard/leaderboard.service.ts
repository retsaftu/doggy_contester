import { Inject, Injectable } from '@nestjs/common';

import * as mongodb from 'mongodb';

@Injectable()
export class LeaderboardService {

  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
  ) { }
  async findSubmissionByContestIdAndUserId(contestId: string, userId: string) {
    return await this.db.collection('submission').aggregate([
      {
        $match: {
          contestId: contestId,
          userId: userId
        }
      },
      {
        $sort: {
          _id: -1
        }
      }
    ]).toArray();

  }

  async getGlobal() {
    return await this.db.collection('user').aggregate([
      {
        $sort: {
          solved: -1
        }
      }
    ]).toArray();
  }

}
