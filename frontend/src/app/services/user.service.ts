import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  getContest(): any {
    return this.http.get('/api/user');
  }

  getUserById(userId: string): any {
    console.log(`userId`, userId);
    return this.http.get(`/api/user/${userId}`);
  }
}
