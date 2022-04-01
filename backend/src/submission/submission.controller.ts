import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file')) // @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateSubmissionDto
  ) {
    return this.submissionService.create(body, file);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubmissionDto: UpdateSubmissionDto) {
    return this.submissionService.update(+id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(+id);
  }
}
