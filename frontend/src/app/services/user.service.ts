import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserBasicInfo, UserProfileInfo } from '../entities/user.entity';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private emitChangeOfUserProfileSource = new Subject<UserBasicInfo>();
  
  changeEmitted$ = this.emitChangeOfUserProfileSource.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }
  
  set userInfo(userInfo: UserBasicInfo) { 
    this.username = userInfo.username;
    localStorage.setItem(environment.USER_INFO_FIELDS.ID, userInfo._id);
    if(userInfo.avatar) {
      this.avatar = userInfo.avatar;
    } else if(!!localStorage.getItem(environment.USER_INFO_FIELDS.AVATAR)){
      localStorage.removeItem(environment.USER_INFO_FIELDS.AVATAR);
    }
    if(userInfo.balance) {
      this.balance = userInfo.balance;
    } else {
      this.balance = 0;
    }

  }

  set username(username: string) {
    localStorage.setItem(environment.USER_INFO_FIELDS.USERNAME, username);
  }

  set avatar(avatar: string) {
    localStorage.setItem(environment.USER_INFO_FIELDS.AVATAR, avatar);
  }

  set balance(balance: number) {
    let currBalance = this.balance;
    currBalance += balance;
    localStorage.setItem(environment.USER_INFO_FIELDS.BALANCE, currBalance.toString())
  }

  get username() { 
    let username = localStorage.getItem(environment.USER_INFO_FIELDS.USERNAME);
    if(!username) {
      username = ''
    }
    return username;
   }

   get avatar() { 
     let avatar = localStorage.getItem(environment.USER_INFO_FIELDS.AVATAR);
     if(!avatar) {
       avatar = '';
     }
     return avatar;
   }

   get balance() {
     let balance = Number(localStorage.getItem(environment.USER_INFO_FIELDS.BALANCE));
     if(!balance) {
       balance = 0.00;
     }
     return balance;
   }

  get userInfo() { 
    const username = this.username;
    let _id = localStorage.getItem(environment.USER_INFO_FIELDS.ID);
    if(!_id) {
      _id = '';
    }
    const avatar = this.avatar;
    return new UserBasicInfo(username, _id, this.balance, avatar);
  }
  
  emitChangeOfUserProfile(info: UserBasicInfo) {
    this.emitChangeOfUserProfileSource.next(info)
  }

  getContest(): any {
    return this.http.get('/api/user');
  }

  getUserById(userId: string): any {
    console.log(`userId`, userId);
    return this.http.get(`/api/user/${userId}`);
  }

  deleteAvatar() {
    return this.http.patch('/api/user/deleteAvatar', null);
  }

  updateUserProfile(userProfileInfo: UserProfileInfo) {
    return this.http.put('/api/user/updateUserProfile', userProfileInfo)
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put('/api/user/changePassword', {oldPassword: oldPassword, newPassword: newPassword })
  }

  recharge(balance: number) {
    return this.http.patch('/api/user/balance/recharge', {balance: balance})
  }

  getGlobalLeaderBoard() {
    return this.http.get('/api/leaderboard/getGlobal')
  }
}
