import { Injectable } from '@angular/core';
import { UserBasicInfo, UserLoginInfo, UserRegistrationInfo } from '../entities/user.entity';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookieService: CookieService, 
    private userService: UserService,
    private http: HttpClient
  ) { }

  register(userRegistrationInfo: UserRegistrationInfo) {
    return this.http.post(`/api/auth/register`, userRegistrationInfo);
  }

  registerByGoogleAccount(userRegistrationInfo: UserRegistrationInfo) {
    return this.http.post(`/api/auth/registerByGoogleAccount`, userRegistrationInfo);
  }

  login(userLoginInfo: UserLoginInfo) {
    return this.http.post(`/api/auth/login`, userLoginInfo)
      .pipe(
        tap((response: any) => {
          console.log('response', response);
          this.userService.userInfo = new UserBasicInfo(response['username'], response['userId'], response['balance'], response['avatar'], response['about'], response['isManager'])
          this.setToken(response['access_token'], response['expirationTime']);
        })
      )
  }

  loginByGoogleAccount(userRegistrationInfo: UserRegistrationInfo) {
    return this.http.post('/api/auth/loginByGoogleAccount', userRegistrationInfo)
      .pipe(
        tap((response: any) => {
          console.log('response', response);
          this.userService.userInfo = new UserBasicInfo(response['username'], response['userId'], response['balance'], response['avatar'], response['about'], response['isManager'])
          this.setToken(response['access_token'], response['expirationTime']);
        })
      );
  }

  confirmEmail(token: string) {
    return this.http.post(`/api/auth/confirmEmail/${token}`, null)
      .pipe(
        tap((response: any) => {
          this.userService.userInfo = new UserBasicInfo(response['username'], response['userId'], response['balance'], response['avatar'])
          this.setToken(response['access_token'], response['expirationTime']);
        })
      );
  }

  logout() {
    this.cookieService.delete(environment.tokenHeader);
  }

  private setToken(token: string, expirationTime: Date) {
    if(!expirationTime) {
      expirationTime = new Date(new Date().setHours(new Date().getHours() + 168));
    }
    this.cookieService.set(environment.tokenHeader, token, expirationTime);
  }

  getToken(): string {
    return "Bearer " + this.cookieService.get(environment.tokenHeader);
  }

  isLoggedIn(): boolean {
    // console.log('auth service[isLoggedIn]', this.cookieService.get(environment.tokenHeader));
    return this.cookieService.check(environment.tokenHeader);
  }

}
