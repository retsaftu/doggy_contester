import { Inject, Injectable } from '@nestjs/common';
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as shelljs from 'shelljs';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db
  ) { }

  async saveSolutionFile(submission: CreateSubmissionDto, file: Express.Multer.File) {
    const fileUTF8 = file.buffer.toString('utf8');
    const submissionDirectory = path.join(__dirname, '../../../', 'uploads', submission.contestId, submission.taskId, submission.user._id, submission.extension.substring(1));
    let filename = "";
    if (submission.extension === '.java') {
      filename = file.originalname;
    } else {
      filename = `main${submission.extension}`;
    }
    const filepath = path.join(submissionDirectory, filename);

    if (!fs.existsSync(submissionDirectory)) {
      fs.mkdirSync(submissionDirectory, { recursive: true });
    }

    fs.writeFileSync(filepath, fileUTF8);

    const fileBase64 = file.buffer.toString('base64');
    submission.file = fileBase64;
    submission.originalName = file.originalname;
    submission.size = file.size;
    submission.timestamp = new Date();

    // const { insertedId } = await this.db.collection('submission').insertOne(submission);

    return {
      // insertedId,
      submissionDirectory
    };
  }

  async downloadTestCases(submission: CreateSubmissionDto, submissionDirectory: string) {
    let multipleCorrectOutput = false;

    const contest = await this.db.collection('contest').findOne({ _id: new mongodb.ObjectID(submission.contestId) });
    if (!contest) {
      return { success: false, message: 'Contest not found' };
    }

    const task = contest.tasks.find(task => task._id.toString() === submission.taskId.toString());
    if (!task) {
      return { success: false, message: 'Task not found' };
    }

    if (task.tests.length < 1) {
      return { success: false, message: 'No test cases found' };
    }

    // Loop through all test cases
    for (let i = 1; i <= task.tests.length; i++) {

      // One test case
      const test = task.tests[i - 1];

      // Create directories for test case input and correct output
      const inputDirectory = path.join(submissionDirectory, 'input');
      const correctDirectory = path.join(submissionDirectory, 'correct');

      if (!fs.existsSync(inputDirectory)) {
        fs.mkdirSync(inputDirectory, { recursive: true });
      }

      if (!fs.existsSync(correctDirectory)) {
        fs.mkdirSync(correctDirectory, { recursive: true });
      }

      // Write test case input into a file
      const inputFilepath = path.join(inputDirectory, `test${i}.in`);
      const input = test.input.join("\r\n");
      fs.writeFileSync(inputFilepath, input);

      // If test case has multiple correct answers
      if (test.output.length > 1) {
        multipleCorrectOutput = true;
      }

      // Write test case correct output into a file
      for (let j = 1; j <= test.output.length; j++) {
        const correctOutputArray = test.output[j - 1];
        const correctFilepath = path.join(correctDirectory, `test${i}.answer${j}.out`);
        const correctOutput = correctOutputArray.join("\r\n");
        fs.writeFileSync(correctFilepath, correctOutput);
      }
    }

    return { success: true, message: 'Test cases successfully downloaded', multipleCorrectOutput, taskName: task.name };
  }

  async runTests(submission: CreateSubmissionDto) {
    let compiler = "";

    shelljs.cd(path.join(__dirname, '../../../compiler/'));
    switch (submission.extension) {
      case '.cpp':
        compiler = path.join(__dirname, "../../../compiler/cpp.sh");
        break;
      case '.py':
        compiler = path.join(__dirname, "../../../compiler/py.sh");
        break;
      case '.java':
        compiler = path.join(__dirname, "../../../compiler/java.sh");
        break;
    }
    shelljs.chmod("+x", compiler);

    shelljs.exec(`${compiler} -c ${submission.contestId} -t ${submission.taskId} -u ${submission.user._id}`);

    const submissionDirectory = path.join(__dirname, '../../../', 'uploads', submission.contestId, submission.taskId, submission.user._id, submission.extension.substring(1));
    const compileErrors = shelljs.cat(path.join(submissionDirectory, 'compile.log'));

    if (compileErrors.stdout.toString().length > 0) {
      return {
        totalTests: 0,
        correctTests: 0,
        testResults: []
      };
    }

    const testResults = [];
    const resultDirectory = path.join(__dirname, '../../../', 'uploads', submission.contestId, submission.taskId, submission.user._id, submission.extension.substring(1), 'result');
    const resultFiles = fs.readdirSync(resultDirectory);
    let testNum = 1;
    for (const file of resultFiles) {
      const fileStream = fs.createReadStream(path.join(resultDirectory, file));

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      const lines = [];

      for await (const line of rl) {
        lines.push(line);
      }

      const time = lines[1].split('.').join('');
      const timeInSeconds = parseInt(time) / 1000;

      testResults.push({
        test: testNum,
        message: lines[0],
        time: timeInSeconds
      });

      testNum++;
    }

    testNum--;

    // count number of correct tests
    let correctTests = 0;
    let totalTime = 0.0
    for (const test of testResults) {
      if (test.message === 'Correct answer') {
        correctTests++;
      }
      totalTime += test.time;
    }

    return {
      totalTests: testNum,
      correctTests,
      testResults,
      solved: testNum === correctTests ? true : false,
      averageTime: Number((totalTime / testNum).toFixed(3))
    };
  }

  async saveTestResults(id: string, testResults: any[]) {
    this.db.collection('submission').updateOne({ _id: new mongodb.ObjectID(id) }, { $set: { testResults } });
  }

  async deleteLocalDirectory(submission: CreateSubmissionDto) {
    const directory = path.join(__dirname, '../../../uploads', submission.contestId);
    shelljs.rm('-rf', directory);
  }

  async findOne(id: string) {
    const submission = await this.db.collection('submission').findOne({ _id: new mongodb.ObjectID(id) });
    submission.file = Buffer.from(submission.file, 'base64').toString();
    return submission;
  }

  async findFile(id: string) {
    const submission = await this.db.collection('submission').findOne({ _id: new mongodb.ObjectID(id) });
    submission.file = Buffer.from(submission.file, 'base64').toString('utf8');
    return submission.file;
  }

  async saveSubmission(submission: CreateSubmissionDto) {
    const { insertedId } = await this.db.collection('submission').insertOne(submission);

    // update user solved and attempted number
    await this.db.collection('users').updateOne(
      { _id: new mongodb.ObjectID(submission.user._id) },
      {
        $inc: {
          attempted: 1,
          solved: submission.solved ? 1 : 0
        }
      }
    );

    return { insertedId };
  }
}
