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

  async create(createContestDto: CreateContestDto, owner: any) {
    console.log(`createContestDto`, createContestDto);
    let createContest = {
      name: createContestDto.name,
      description: createContestDto.description,
      owner: {
        _id: new mongodb.ObjectId(owner._id),
        name: owner.username
      },
      total_participants: createContestDto.total_participants,
      participants: [],
      startDate: new Date(createContestDto.startDate),
      endDate: new Date(createContestDto.endDate),
      premium: createContestDto.premium,
      price: createContestDto?.price,
      cush: 0,
      tasks: []
    }
    console.log(`createContest`, createContest);
    // createContest.name = createContestDto.name;
    // createContest.description = createContestDto.description;
    // createContest.owner._id = owner._id;
    // createContest.owner.name = owner.username;
    // createContest.total_participants = createContestDto.total_participants;
    // createContest.startDate = createContestDto.startDate;
    // createContest.endDate = createContestDto.endDate;


    console.log(`createContestDto`, JSON.stringify(createContestDto.tasks));

    for (let _task of createContestDto.tasks) {
      let newTask = {
        _id: new mongodb.ObjectId(),
        index: _task.index,
        name: _task.name,
        description: _task.description,
        inputExample: _task.inputExample,
        outputExample: _task.outputExample,
        code: _task.code,
        time: _task.time,
        memory: _task.memory,
        tests: []
        // input: [],
        // output: []
      }
      console.log(`newTask`, newTask);

      // let counter = 0;
      for (let index = 0; index < _task.tests.length; index++) {
        let input = [];
        let output = [];
        input.push(_task.tests[index].input);
        let preOutput = [];
        preOutput.push(_task.tests[index].output)
        output.push(preOutput);
        newTask.tests.push({
          input: input,
          output: output,
        })
        // output = output + _task.tests[index].output;
        // counter++;
      }
      console.log(`JSON.stringify(newTask)`, JSON.stringify(newTask));
      // input = input;
      // newTask.input = input;
      // newTask.output = output;
      createContest.tasks.push(newTask)
      // console.log(`input`, input);
      // console.log(`output`, output);
    }
    return await this.db.collection('contest').insertOne(createContest);
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
          "owner._id": new mongodb.ObjectId(myid),
          // startDate: {
          //   $lt: new Date()
          // },
          endDate: {
            $gt: new Date(),
          }
        }
      }
    ]).toArray());
  }

  async findMyActiveContest(myid: string) {
    return (await this.db.collection('contest').aggregate([
      {
        $match: {
          'participants._id': new mongodb.ObjectId(myid),
          startDate: {
            $lt: new Date()
          },
          endDate: {
            $gt: new Date()
          }
        }
      }
      // {
      //   $unwind: "$participants"
      // },
      // {
      //   $match: {
      //     'participants._id': new mongodb.ObjectId(myid),
      //     startDate: {
      //       $lt: new Date()
      //     },
      //     endDate: {
      //       // $gte: new Date("2013-01-01T00:00:00.0Z"),
      //       $gt: new Date()
      //     }
      //   }
      // }
    ]).toArray());
  }

  async findCurrentContests(myid: string) {
    return (await this.db.collection('contest').aggregate([
      {
        $match: {
          'participants._id': {
            $ne: new mongodb.ObjectId(myid)
          },
          'owner._id': {
            $ne: new mongodb.ObjectId(myid)
          },
          startDate: {
            $lt: new Date()
          },
          endDate: {
            $gt: new Date()
          }
        }
      }
      // {
      //   $unwind: "$participants"
      // },
      // {
      //   $match: {
      //     'participants._id': {
      //       $ne: new mongodb.ObjectId(myid)
      //     },
      //     startDate: {
      //       $lt: new Date()
      //     },
      //     endDate: {
      //       // $gte: new Date("2013-01-01T00:00:00.0Z"),
      //       $gt: new Date()
      //     }
      //   }
      // },
    ]).toArray());
  }

  async findCurrentContestsForUnauthorizedUser() {
    const currentDate = new Date();
    console.log(currentDate)
    return (await this.db.collection('contest').aggregate([
      {
        $match: {
          startDate: {
            $lt: new Date()
          },
          endDate: {
            // $gte: new Date("2013-01-01T00:00:00.0Z"),
            $gt: new Date()
          }
        }
      }
    ]).toArray());
  }

  async findOne(id: string) {
    return (await this.db.collection('contest').aggregate([
      {
        $match: {
          _id: new mongodb.ObjectId(id)
        }
      }
    ]).toArray());
  }

  update(id: number, updateContestDto: UpdateContestDto) {
    return `This action updates a #${id} contest`;
  }

  remove(id: number) {
    return `This action removes a #${id} contest`;
  }

  async joinContest(contestId: string, userId: string, username: string) {
    const check = (await this.db.collection('contest').aggregate([
      {
        $match: {
          _id: new mongodb.ObjectId(contestId),
          premium: true
        }
      }
    ]).toArray())[0]
    if (check) {
      const peny = check.price;

      console.log(`userId`, userId);

      const user = (await this.db.collection('users').aggregate(
        [{
          $match: {
            _id: new mongodb.ObjectId(userId)
          }
        }]
      ).toArray())[0]
      console.log(`user`, user);
      if (user.balance >= peny) {

        const newBalance = user.balance - peny;

        await (this.db.collection('users').updateOne(
          { "_id": new mongodb.ObjectId(userId) },
          {
            $set: {
              balance: newBalance
            }
          }
        ))

        const newCush = check.cush + peny;
        await (this.db.collection('contest').updateOne(
          { "_id": new mongodb.ObjectId(contestId) },
          {
            $set: {
              cush: newCush
            }
          }
        ))

        await (this.db.collection('contest').updateOne(
          { "_id": new mongodb.ObjectId(contestId) },
          {
            $push: {
              participants: {
                _id: new mongodb.ObjectId(userId),
                name: username
              }
            }
          }
        ))
      } else {
        return "deneg malo"
      }
    } else {

      await (this.db.collection('contest').updateOne(
        { "_id": new mongodb.ObjectId(contestId) },
        {
          $push: {
            participants: {
              _id: new mongodb.ObjectId(userId),
              name: username
            }
          }
        }
      ))
    }

  }


}
