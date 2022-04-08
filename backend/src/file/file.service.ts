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



    streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })
    }
    async startCompile(fileId: string, user, data: CreateSubmissionDto) {
        const userId = user._id;
        const contestId = data.contestId;
        const taskId = data.taskId;
        const filestream = await this.readStream(fileId);
        const codeF = await this.streamToString(filestream);
        const code = await codeF.toString().replace(/"/g, '\"')
        let language = data.extension.split('.')[1]


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
        const grep = `ls -l ./uploads/${userId} | grep ${taskId}`;
        const grep2 = `ls -l ./uploads/ | grep ${userId}`;
        const check = shell.exec(grep);
        const check2 = shell.exec(grep2);
        if (check.stdout) {
            const rmDir = `rm -dr ./uploads/${userId}/${taskId}`;
            shell.exec(rmDir);
        }
        if (check2.stdout) {
            const preDir = `mkdir ./uploads/${userId}`
            shell.exec(preDir);

        }

        const dir = `mkdir ./uploads/${userId}/${taskId} &&
         mkdir ./uploads/${userId}/${taskId}/input  && 
         mkdir ./uploads/${userId}/${taskId}/output`;

        const touchFile = `echo -e "${code}" > ./uploads/${userId}/${taskId}/${taskId}.${language}`
        console.log(`touchFile`, touchFile);
        const renameCpp = "cd ./uploads &&" + "cp main.cpp ../uploads/" + userId + "/" + userId + ".cpp";
        const compileClang = "cd ./uploads/" + userId + " && clang++ -o CompileForUser " + userId + ".cpp";
        // const input = "cd ./uploads/" + userId + " && echo '" + taskInput + "' >> ./input/a.in";
        // const output = "cd ./uploads/" + userId + " && echo -n '" + taskOutput + "' >> ./output/a.out " + " && sed -i 's/\x20//g' ./output/a.out";
        const cpImage = "cp ./images/mainbash ./uploads/" + userId + " && chmod 777 ./uploads/" + userId + "/mainbash && sed -i 's/\r$//' ./uploads/" + userId + "/mainbash";
        const mainbash = " cd ./uploads/" + userId + " && ./mainbash";




        shell.exec(dir);
        shell.exec(touchFile);
        console.log(`code`, code);
        console.log(`typeof(code)`, typeof (code));




        let test = 'ls -la';
        let mkdir = `mkdir ${user._id}`
        // const test2 = shell.exec(test);
        // console.log(`test2`, test2);



        return 'asd'
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