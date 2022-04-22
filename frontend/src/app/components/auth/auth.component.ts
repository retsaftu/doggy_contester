import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AuthService } from 'src/app/services/auth.service';
import { UserLoginInfo, UserRegistrationInfo } from 'src/app/entities/user.entity';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';

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

  private _isRegistrationLoading = false;
  
  private _isLoginLoading = false;

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
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBarService: SnackBarService) { }

  ngOnInit(): void {

    if(this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }

    // Changing theme
    let currentTheme = localStorage.getItem(environment.themeField);
    if (currentTheme == '' || currentTheme == undefined || currentTheme == null) {
      currentTheme = this.lightThemeClass;
    }
    this.renderer.setAttribute(this.document.body, 'class', this.DEFAULT_CLASSES + ' ' + currentTheme);

    // Changing form
    this.activatedRoute.queryParams.subscribe(params => {
      if(!!params['signUp'] && params['signUp'] == "show") {
        this.showLoginPage = false;
      }
    })
  }

  registerByGoogleAccount() {
    this.isRegistrationLoading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      const email = user.email;
      const username = email.substring(0, email.indexOf('@'));
      const photo = user.photoUrl;
      const registerUserInfo = new UserRegistrationInfo(username, email, user.name, username, photo);
      if(this.isRegistrationLoading) {
        this.isRegistrationLoading = false;
        this.authService.registerByGoogleAccount(registerUserInfo).subscribe((res) => {
          this.authService.login(new UserLoginInfo(email, username)).subscribe((res) => {
            this.router.navigate([''])
            this.snackBarService.openWarnSnackBar("Change your password in settings! Your current password is your username");
          })
        })
      }
    });
  }

  register() {
    if(!this.isRegistrationFormValid()) {
      return;
    }
    const registerUserInfo = new UserRegistrationInfo(this.registrationFormUsername?.value,
                                                      this.registrationFormEmail?.value,
                                                      this.registrationFormName?.value,
                                                      this.registrationFormPassword?.value);
    this.isRegistrationLoading = true;
    this.authService.register(registerUserInfo).subscribe({
      next: (res) => {
        console.log(res);
        this.snackBarService.openInfoSnackBar("Registered successfully! Please confirm email", 5000);
        this.isRegistrationLoading = false;
        this.clearRegistrationForm();
      },
      error: (err) => {
        this.isRegistrationLoading = false
      }
    })
  }

  loginByGoogleAccount() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
      const email = user.email;
      const username = email.substring(0, email.indexOf('@'));
      const photo = user.photoUrl;
      const registerUserInfo = new UserRegistrationInfo(username, email, user.name, username, photo);
      this.authService.loginByGoogleAccount(registerUserInfo).subscribe((res) => {
        this.router.navigate(['']);
        if(res.created) {
          this.snackBarService.openWarnSnackBar("Change your password in settings! Your current password is your username");
        }
      })
    });
  }

  login() {
    if(!this.isLoginFormValid()) {
      return;
    }
    const loginUserInfo = new UserLoginInfo(this.loginFormEmail?.value, this.loginFormPassword?.value);
    this.isLoginLoading = true;
    this.authService.login(loginUserInfo).subscribe({
      next: (res) => {
        this.isLoginLoading = false;
        this.clearLoginForm();
        this.router.navigate([''])
      },
      error: (err) => this.isLoginLoading = false
    }); // TODO: обработать ответ
  }

  isRegisterFormFieldsAreEmpty() {
    return this.registrationFormUsername?.hasError('required') || this.registrationFormEmail?.hasError('required') 
    || this.registrationFormPassword?.hasError('required');
  }

  isRegistrationFormValid() {
    return !this.isRegisterFormFieldsAreEmpty() && !this.registrationFormEmail?.hasError('email')
  }

  private clearRegistrationForm() {
    this.registrationFormEmail?.reset();
    this.registrationFormName?.reset();
    this.registrationFormUsername?.reset();
    this.registrationFormPassword?.reset();
  }

  isLoginFormFieldsAreEmpty() {
    return this.loginFormEmail?.hasError('required') || this.loginFormPassword?.hasError('required');
  }

  isLoginFormValid() {
    return !this.isLoginFormFieldsAreEmpty() && !this.loginFormEmail?.hasError('email');
  }

  private clearLoginForm() {
    this.loginFormEmail?.reset();
    this.loginFormPassword?.reset();
  }

  get loginFormEmail() { return this.loginForm.get('email'); }

  get loginFormPassword() { return this.loginForm.get('password'); }

  get registrationFormUsername() { return this.registrationForm.get('username'); }

  get registrationFormEmail() { return this.registrationForm.get('email'); }

  get registrationFormPassword() { return this.registrationForm.get('password'); }

  get registrationFormName() { return this.registrationForm.get('name'); }

  set isRegistrationLoading(value: boolean) {
    this._isRegistrationLoading = value;
    if(this._isRegistrationLoading) {
      this.registrationFormEmail?.disable();
      this.registrationFormUsername?.disable();
      this.registrationFormPassword?.disable();
      this.registrationFormName?.disable();
    } else {
      this.registrationFormEmail?.enable();
      this.registrationFormUsername?.enable();
      this.registrationFormPassword?.enable();
      this.registrationFormName?.enable();
    }
  }

  get isRegistrationLoading() { return this._isRegistrationLoading; }

  set isLoginLoading(value: boolean) {
    this._isLoginLoading = value;
    if(this._isLoginLoading) {
      this.loginFormEmail?.disable();
      this.loginFormPassword?.disable();
    } else {
      this.loginFormEmail?.enable();
      this.loginFormPassword?.enable();
    }
  }

  get isLoginLoading() { return this._isLoginLoading }

  continueAsGuest(){
    this.router.navigate([''])
  }

}
