import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
}
