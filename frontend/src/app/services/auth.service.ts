import { Injectable } from '@angular/core';
import { UserLoginInfo, UserRegistrationInfo } from '../entities/user.entity';
import { CookieService } from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService,
              private http: HttpClient) { }

  registerByGoogleAccount(userRegistrationInfo: UserRegistrationInfo, googleToken: string, expires_at?: string) {
    const expirationTime = expires_at == undefined ? new Date(60 * 60 * 24) : new Date(Number(expires_at))
    this.setToken(googleToken, expirationTime);
    // TODO: отправить запрос на правильный url
    return this.http.post(`${environment.getApiUrl()}/api/auth/registerByGoogleAccount`, userRegistrationInfo);
  }

  register(userRegistrationInfo: UserRegistrationInfo) {
    // TODO: отправить запрос на правильный url
    return this.http.post(`${environment.getApiUrl()}/api/auth/registerByGoogleAccount`, userRegistrationInfo);
  }

  login (userLoginInfo: UserLoginInfo) {
    // TODO: отправить запрос на правильный url
    return this.http.get(`${environment.getApiUrl()}/api/auth/login?${userLoginInfo}`)
      .pipe(
        tap((response: any) => {
          this.setToken(response['token'], response['expirationTime']);
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
    return this.cookieService.get(environment.tokenHeader);
  }

  isLoggedIn(): boolean{
    console.log('auth service[isLoggedIn]', this.cookieService.get(environment.tokenHeader));
    return this.cookieService.check(environment.tokenHeader);
  }

}
