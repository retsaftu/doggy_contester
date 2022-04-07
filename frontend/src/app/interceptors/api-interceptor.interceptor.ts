import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { tap, map } from 'rxjs';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable()
export class ApiInterceptorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
    private snackBarService: SnackBarService) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  console.log(`[interceptor] Token: ${this.authService.getToken()}`)

  const headersFroInterceptor: any = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET',
  // 'Content-Type':  'application/json',
  }

  if(this.authService.isLoggedIn()) {
    headersFroInterceptor[environment.tokenHeader] = this.authService.getToken();
  }

  const authReq = req.clone({
    headers: new HttpHeaders(headersFroInterceptor)
  });


  return next.handle(authReq)
        .pipe(
          tap({
            next: (event) => {},
            error: (error) => {
              console.log(`[interceptor] error`, error);
              this.snackBarService.openErrorSnackBar(error.error.message);
            }
          })
        );
  }
}
