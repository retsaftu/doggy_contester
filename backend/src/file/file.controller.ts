import { Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileResponseVm } from './dto/file-response-vm.model';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('')
  @UseInterceptors(FilesInterceptor('file'))
  upload(@UploadedFiles() file) {
    console.log(`files`, file);
    const response = [];
    // files.forEach(file => {
    //   const fileReponse = {
    //     originalname: file.originalname,
    //     encoding: file.encoding,
    //     mimetype: file.mimetype,
    //     id: file.id,
    //     filename: file.filename,
    //     metadata: file.metadata,
    //     bucketName: file.bucketName,
    //     chunkSize: file.chunkSize,
    //     size: file.size,
    //     md5: file.md5,
    //     uploadDate: file.uploadDate,
    //     contentType: file.contentType,
    //   };
    //   response.push(fileReponse);
    // });
    return file;
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
