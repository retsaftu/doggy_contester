import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as path from 'path';
import { SubmissionService } from './submission.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() submission: any,
    @Req() req: any
  ) {
    const supportedFileExtensions = ['.cpp', '.py', '.java'];

    
    if (!file)
    return { success: false, message: 'No file uploaded' };
    
    const fileExtension = path.extname(file.originalname);

    if (!supportedFileExtensions.includes(fileExtension) ||
        !supportedFileExtensions.includes(submission.extension))
      return { success: false, message: 'File extension not supported' };

    if (fileExtension !== submission.extension)
      return { success: false, message: 'File extension does not match' };

    if (!submission.contestId || !submission.taskId || !req.user._id)
      return { success: false, message: 'Missing required fields' };

    submission.user = {
      _id: req.user._id,
      username: req.user.username
    };

    const { submissionDirectory } = await this.submissionService.saveSolutionFile(submission, file);

    const { taskName } = await this.submissionService.downloadTestCases(submission, submissionDirectory);
    submission.taskName = taskName;

    const {
      totalTests,
      correctTests,
      testResults,
      solved,
      averageTime
    } = await this.submissionService.runTests(submission);
    submission.totalTestCases = totalTests;
    submission.correctTestCases = correctTests;
    submission.testResults = testResults;
    submission.solved = solved;
    submission.averageTime = averageTime;

    if (testResults.length === 0 && averageTime === 0) {
      await this.submissionService.deleteLocalDirectory(submission);
      return { success: false, message: 'Compilation error' };
    }

    // await this.submissionService.saveTestResults(insertedId.toString(), testResults);

    // await this.submissionService.saveSubmission(submission, file);

    await this.submissionService.deleteLocalDirectory(submission);

    submission.originalName = file.originalname;
    submission.file = file.buffer.toString('base64');
    submission.size = file.size;
    submission.timestamp = new Date();

    const { insertedId } = await this.submissionService.saveSubmission(submission);

    return {
      success: true,
      ...submission
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':submissionId')
  async findOne(@Param('submissionId') submissionId: string) {
    return this.submissionService.findOne(submissionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('file/:submissionId')
  async findFile(@Param('submissionId') submissionId: string) {
    return this.submissionService.findFile(submissionId);
  }
}
