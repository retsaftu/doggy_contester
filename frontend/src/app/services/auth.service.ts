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

  registerByGoogleAccount(userRegistrationInfo: UserRegistrationInfo, googleToken: string, expires_at?: string) {
    const expirationTime = expires_at == undefined ? new Date(60 * 60 * 24) : new Date(Number(expires_at))
    this.setToken(googleToken, expirationTime);
    // TODO: отправить запрос на правильный url
    return this.http.post(`/api/auth/registerByGoogleAccount`, userRegistrationInfo);
  }

  register(userRegistrationInfo: UserRegistrationInfo) {
    return this.http.post(`/api/auth/register`, userRegistrationInfo);
  }

  login(userLoginInfo: UserLoginInfo) {
    return this.http.post(`/api/auth/login`, userLoginInfo)
      .pipe(
        tap((response: any) => {
          this.userService.userInfo = new UserBasicInfo(response['username'], response['userId'])
          this.setToken(response['access_token'], response['expirationTime']);
        })
      )
  }

  loginByGoogleAccount(googleToken: string, expires_at?: string) {
    const expirationTime = expires_at == undefined ? new Date(60 * 60 * 24) : new Date(Number(expires_at))
    this.setToken(googleToken, expirationTime);
  }

  logout() {
    this.cookieService.delete(environment.tokenHeader);
  }

  private setToken(token: string, expirationTime: Date) {
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
