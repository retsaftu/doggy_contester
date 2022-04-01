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
    createSubmissionDto.mimetype = file.mimetype;
    createSubmissionDto.timestamp = new Date();

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

  findOne(id: number) {
    return `This action returns a #${id} submission`;
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: number) {
    return `This action removes a #${id} submission`;
  }
}
