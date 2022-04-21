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
          "user._id": userId
        }
      },
      {
        $sort: {
          _id: -1
        }
      },
      {
        $project: {
          _id: 1,
          contestId: 1,
          taskId: 1,
          extension: 1,
          user: 1,
          size: 1,
          timestamp: 1,
          taskName: 1,
          totalTestCases: 1,
          correctTestCases: 1,
          testResults: 1,
          solved: 1,
          averageTime: 1
        }
      }
    ]).toArray();

  }

  async getGlobal() {
    console.log('getGlobal');

    return await this.db.collection('users').aggregate([
      {
        $sort: {
          solved: -1,
          attempted: 1,
        }
      },
      {
        $project: {
          _id: 0,
          username: 1,
          name: 1,
          solved: 1,
          attempted: 1
        }
      }
    ]).toArray();
  }

}
