import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserBasicInfo } from '../entities/user.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }
  
  set userInfo(userInfo: UserBasicInfo) { 
    this.cookieService.set(environment.USER_INFO_FIELDS.USERNAME, userInfo.username);
    this.cookieService.set(environment.USER_INFO_FIELDS.ID, userInfo._id);
    if(userInfo.avatar) {
      this.cookieService.set(environment.USER_INFO_FIELDS.AVATAR, userInfo.avatar);
    }
  }

  get userInfo() { 
    const username = this.cookieService.get(environment.USER_INFO_FIELDS.USERNAME);
    const _id = this.cookieService.get(environment.USER_INFO_FIELDS.ID);
    const avatar = this.cookieService.get(environment.USER_INFO_FIELDS.AVATAR);
    return new UserBasicInfo(username, _id, avatar);
  }

  getContest(): any {
    return this.http.get('/api/user');
  }

  getUserById(userId: string): any {
    console.log(`userId`, userId);
    return this.http.get(`/api/user/${userId}`);
  }
}
