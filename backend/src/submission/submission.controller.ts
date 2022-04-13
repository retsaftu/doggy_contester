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
    @Body() body: any,
    @Req() req: any
  ) {
    const supportedFileExtensions = ['.cpp', '.py'];

    if (!file)
      return { success: false, message: 'No file uploaded' };

    if (!supportedFileExtensions.includes(path.extname(file.originalname)) ||
        !supportedFileExtensions.includes(body.extension))
      return { success: false, message: 'File extension not supported' };

    if (!body.contestId || !body.taskId || !req.user._id)
      return { success: false, message: 'Missing required fields' };
    
    body.userId = req.user._id;

    const { insertedId, submissionDirectory } = await this.submissionService.saveSolutionFile(body, file);

    await this.submissionService.downloadTestCases(body.taskId, body.contestId, submissionDirectory);

    const testResults = await this.submissionService.runTests(body.contestId, body.taskId, body.userId, body.extension);

    await this.submissionService.saveTestResults(insertedId.toString(), testResults);

    await this.submissionService.deleteLocalDirectory(body.contestId);

    return { success: true, insertedId, testResults };
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
