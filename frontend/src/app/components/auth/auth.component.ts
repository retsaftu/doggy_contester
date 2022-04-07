import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AuthService } from 'src/app/services/auth.service';
import { UserLoginInfo, UserRegistrationInfo } from 'src/app/entities/user.entity';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  private readonly lightThemeClass = 'theme-light';
  private readonly DEFAULT_CLASSES = 'mat-typography mat-app-background' // Без этого ничего не работает

  showLoginPage = true;

  hidePassword = true;

  registrationForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private socialAuthService: SocialAuthService,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document, private renderer: Renderer2,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Changing theme
    let currentTheme = localStorage.getItem(environment.themeField);
    if (currentTheme == '' || currentTheme == undefined || currentTheme == null) {
      currentTheme = this.lightThemeClass;
    }
    this.renderer.setAttribute(this.document.body, 'class', this.DEFAULT_CLASSES + ' ' + currentTheme);

    // Changing form
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      if (!!params['signUp'] && params['signUp'] == "show") {
        this.showLoginPage = false;
        console.log('here')
      }
    })
  }

  registerByGoogleAccount() {
    console.log('rafael');

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      const email = user.email;
      const username = email.substring(0, email.indexOf('@'));
      const registerUserInfo = new UserRegistrationInfo(username, email, user.name);
      this.authService.registerByGoogleAccount(registerUserInfo, user.authToken, user.response?.expires_at).subscribe((res) => {
        console.log(`res`, res);
      }) // TODO: обработать ответ
    });
  }

  register() {
    if (this.isRegisterFormFieldsAreEmpty()) {
      return;
    }
    const registerUserInfo = new UserRegistrationInfo(this.registrationFormUsername?.value,
      this.registrationFormEmail?.value,
      this.registrationFormName?.value,
      this.registrationFormPassword?.value);
    this.authService.register(registerUserInfo); // TODO: обработать ответ
  }

  loginByGoogleAccount() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
      this.authService.loginByGoogleAccount(user.authToken, user.response?.expires_at) // TODO: обработать ответ
    });
  }

  login() {
    if (this.isLoginFormFieldsAreEmpty()) {
      return;
    }
    const loginUserInfo = new UserLoginInfo(this.loginFormEmail?.value, this.loginFormPassword?.value);
    this.authService.login(loginUserInfo); // TODO: обработать ответ
  }

  isLoginFormFieldsAreEmpty() {
    return this.loginFormEmail?.hasError('required') || this.loginFormPassword?.hasError('required');
  }

  isRegisterFormFieldsAreEmpty() {
    return this.registrationFormUsername?.hasError('required') || this.registrationFormEmail?.hasError('required')
      || this.registrationFormPassword?.hasError('required');
  }

  get loginFormEmail() { return this.loginForm.get('email'); }

  get loginFormPassword() { return this.loginForm.get('password'); }

  get registrationFormUsername() { return this.registrationForm.get('username'); }

  get registrationFormEmail() { return this.registrationForm.get('email'); }

  get registrationFormPassword() { return this.registrationForm.get('password'); }

  get registrationFormName() { return this.registrationForm.get('name'); }

}
