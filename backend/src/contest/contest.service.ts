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
        _id: owner._id,
        name: owner.username
      },
      total_participants: createContestDto.total_participants,
      startDate: createContestDto.startDate,
      endDate: createContestDto.endDate,
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




    for (let _task of createContestDto.tasks) {
      let newTask = {
        index: _task.index,
        name: _task.name,
        description: _task.description,
        inputExample: _task.inputExample,
        outputExample: _task.outputExample,
        code: _task.code,
        time: _task.time,
        memory: _task.memory,
        input: '',
        output: ''
      }
      console.log(`newTask`, newTask);
      let input = '';
      let output = '';
      let counter = 0;
      for (let index = 0; index < _task.tests.length; index++) {
        input = input + _task.tests[index].input;
        output = output + _task.tests[index].output;
        counter++;

      }
      input = counter.toString() + '\n' + input;
      newTask.input = input;
      newTask.output = output;
      createContest.tasks.push(newTask)
      console.log(`input`, input);
      console.log(`output`, output);
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
