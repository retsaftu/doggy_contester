import { Inject, Injectable } from '@nestjs/common';
import * as mongodb from 'mongodb';
import { threadId } from 'worker_threads';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto, file: Express.Multer.File) {
    createSubmissionDto.file = file.buffer.toString('base64');
    createSubmissionDto.originalName = file.originalname;
    createSubmissionDto.size = file.size;
    createSubmissionDto.timestamp = new Date();

    const fileType = file.originalname.split('.').pop();
    createSubmissionDto.type = fileType;

    console.log(fileType);

    return this.db.collection('submission').insertOne(createSubmissionDto);
  }

  async findAll() {
    const submissions = await this.db.collection('submission').find().toArray();
    submissions.forEach(submission => {
      const submissionFile = Buffer.from(submission.file, 'base64').toString();

      const submissionDate = new Date(submission.timestamp).toDateString();
      const submissionTime = new Date(submission.timestamp).toTimeString();

      submission.file = submissionFile;
      
      // console.log(`${submissionDate} ${submissionTime}`);
      // console.log(submissionFile);
    });
    return submissions;
  }

  async findOne(id: string) {
    const submission = await this.db.collection('submission').findOne({ _id: new mongodb.ObjectID(id) });
    submission.file = Buffer.from(submission.file, 'base64').toString();
    return submission;
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: number) {
    return `This action removes a #${id} submission`;
  }
}
