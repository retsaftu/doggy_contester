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
    formData.append('settings', JSON.stringify({ "userId": uId }));
    formData.append('file', file);
    console.log(`formData`, formData);
    let formData2 = { rafa: 'rafa' }
    return this.http.post('/api/submission', formData);
  }
}
