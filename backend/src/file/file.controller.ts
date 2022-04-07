import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileResponseVm } from './dto/file-response-vm.model';
import { CreateSubmissionDto } from './dto/submission-dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FilesInterceptor('file'))
  async upload(
    @UploadedFiles() file,
    @Req() req: any,
    @Body() data: CreateSubmissionDto,
  ) {
    console.log(`data`, data);
    // console.log(`files`, file);
    // console.log(`file[0].id`, file[0].id);
    const filestream = await this.fileService.readStream(file[0].id)
    function streamToString(stream) {
      const chunks = [];
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
    }

    const code = await streamToString(filestream)
    // console.log(`result`, result);
    return this.fileService.addSubmission(file[0].id, req.user, data, code)
  }


  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadImage(
    @UploadedFiles() file,
    @Req() req: any,
    // @Body() data: CreateSubmissionDto,
  ) {
    // console.log(`data`, data);
    // console.log(`files`, file);
    // console.log(`file[0].id`, file[0].id);

    // console.log(`result`, result);
    return this.fileService.updateImage(file[0].id, req.user)
  }



  @Get('info/:id')
  async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.fileService.findInfo(id)
    const filestream = await this.fileService.readStream(id)
    if (!filestream) {
      return
    }
    return {
      message: 'File has been detected',
      file: file
    }
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.fileService.findInfo(id)
    const filestream = await this.fileService.readStream(id)
    if (!filestream) {
      return 'error'

    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res)
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.fileService.findInfo(id)
    const filestream = await this.fileService.readStream(id)
    if (!filestream) {
      return 'error'
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res)
  }
}
