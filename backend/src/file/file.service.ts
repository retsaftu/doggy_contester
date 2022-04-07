import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs'
import { GridFSBucketReadStream } from 'mongodb'
import { FileInfoVm } from './dto/file-info-vm.model'
import { response } from 'express';


import * as mongodb from 'mongodb';
import { CreateSubmissionDto } from './dto/submission-dto';
import * as shell from 'shelljs'

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

    async startCompile(fileId: string, user, data: CreateSubmissionDto) {
        const userId = user._id;
        const contestId = data.contestId;
        const taskId = data.taskId;
        const checker = (await this.db.collection('contest').aggregate([
            {
                $match: {
                    _id: new mongodb.ObjectId(contestId)
                }
            },
            {
                $unwind: "$tasks"
            },
            {
                $match: {
                    'tasks._id': new mongodb.ObjectId(taskId)
                }
            },
            {
                $project: {
                    tasks: {
                        input: 1,
                        output: 1,
                        time: 1,
                        memory: 1
                    }
                }
            }

        ]).toArray())[0]
        console.log(`checker`, checker);
        const grep = `ls -l ./uploads | grep ${userId}`;
        const check = shell.exec(grep);
        if (check.stdout){
            const rmDir = "rm -dr ./uploads/" + userId;
            shell.exec(rmDir);
        }

        const dir = "mkdir ./uploads/" + userId + " && mkdir ./uploads/" + userId + "/input" + " && mkdir ./uploads/" + userId + "/output";
        console.log(`check.stdout`, check.stdout);
        shell.exec(dir);

        

        let test = 'ls -la';
        let mkdir = `mkdir ${user._id}`
        const test2 = shell.exec(test);
        console.log(`test2`, test2);
        return test2
        // return await this.db.collection('users').updateOne(
        //     { _id: new mongodb.ObjectId(user._id) },
        //     {
        //         $set: {
        //             avatar: `/api/file/${fileId}`,
        //         }
        //     }
        // )
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
                links: {
                    view: `/api/file/${fileId}`,
                    download: `/api/file/download/${fileId}`
                }
            }
        );
    }

    async updateImage(fileId: string, user) {

        return await this.db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(user._id) },
            {
                $set: {
                    avatar: `/api/file/${fileId}`,
                }
            }
        )
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