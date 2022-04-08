import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient,
  ) { }

  uploadOne(file: File, uId: any): any {
    console.log('uploadOne');
    console.log(`file`, file);
    console.log(`uId`, uId);
    let formData = new FormData();
    formData.append('file', file);
    formData.append('contestId', '60c09af61d2fc08732e62edd');
    formData.append('taskId', '60c09b891d2fc08732e62ede');
    formData.append('extension', '.js');
    console.log(`formData`, formData);
    return this.http.post('/api/file', formData);
  }

  uploadAvatar(file: File) {
    console.log('uploadOne');
    console.log(`file`, file);
    let formData = new FormData();
    formData.append('file', file);
    // formData.append('contestId', '60c09af61d2fc08732e62edd');
    // formData.append('taskId', '60c09b891d2fc08732e62ede');
    // formData.append('extension', '.');
    console.log(`formData`, formData);
    return this.http.post('/api/file/image', formData);
  }
}
