import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs'
import { GridFSBucketReadStream } from 'mongodb'
import { FileInfoVm } from './dto/file-info-vm.model'
import { response } from 'express';


import * as mongodb from 'mongodb';
import { CreateSubmissionDto } from './dto/submission-dto';

@Injectable()
export class FileService {
    private fileModel: MongoGridFS;

    // constructor(@InjectConnection() private readonly connection: Connection) {
    //     this.fileModel = new MongoGridFS(this.connection.db, 'fs');
    // }
    constructor(
        @Inject('DATABASE_CONNECTION') private db: mongodb.Db
    ) {
        this.fileModel = new MongoGridFS(this.db, 'fs');
    }

    async addSubmission(fileId: string, user, data: CreateSubmissionDto, code) {
        let language = data.extension.split('.')[1]
        console.log(`language`, language);
        return await this.db.collection('submissions').insertOne(
            {
                file: {
                    fileId: fileId,
                    language: language,
                    code: code,
                },
                user: {
                    username: user.username,
                    userId: user._id,
                },
                submission: {
                    contestId: data.contestId,
                    taskId: data.taskId,
                },
                links:{
                    view:'',
                    download:''
                }


            }
        );
    }



    async readStream(id: string): Promise<GridFSBucketReadStream> {
        return await this.fileModel.readFileStream(id);
    }

    async findInfo(id: string): Promise<FileInfoVm> {
        const result = await this.fileModel
            .findById(id).catch(err => { throw new HttpException('File not found', HttpStatus.NOT_FOUND) })
            .then(result => result)
        return {
            filename: result.filename,
            length: result.length,
            chunkSize: result.chunkSize,
            md5: result.md5,
            contentType: result.contentType
        }
    }

    async deleteFile(id: string): Promise<boolean> {
        return await this.fileModel.delete(id)
    }
}