import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, SocialUser  } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AuthService } from 'src/app/services/auth.service';
import { UserLoginInfo, UserRegistrationInfo } from 'src/app/entities/user.entity';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  showLoginPage = true;

  hidePassword = true;

  registrationForm = new FormGroup({
    name: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private socialAuthService: SocialAuthService,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  registerByGoogleAccount() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user);
      const email = user.email;
      const username =  email.substring(0, email.indexOf('@'));
      const registerUserInfo = new UserRegistrationInfo(username, email, user.name);
      this.authService.registerByGoogleAccount(registerUserInfo, user.authToken, user.response?.expires_at) // TODO: обработать ответ
    });
  }

  register() {
    if(this.isRegisterFormFieldsAreEmpty()) {
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
    if(this.isLoginFormFieldsAreEmpty()) {
      return;
    }
    const loginUserInfo = new UserLoginInfo(this.loginFormUsername?.value, this.loginFormPassword?.value);
    this.authService.login(loginUserInfo); // TODO: обработать ответ
  }

  isLoginFormFieldsAreEmpty() {
    return this.loginFormUsername?.hasError('required') || this.loginFormPassword?.hasError('required');
  }

  isRegisterFormFieldsAreEmpty() {
    return this.registrationFormUsername?.hasError('required') || this.registrationFormEmail?.hasError('required') 
    || this.registrationFormPassword?.hasError('required');
  }

  get loginFormUsername() {return this.loginForm.get('username');}

  get loginFormPassword() {return this.loginForm.get('password');}

  get registrationFormUsername() {return this.registrationForm.get('username');}

  get registrationFormEmail() {return this.registrationForm.get('email');}

  get registrationFormPassword() {return this.registrationForm.get('password');}

  get registrationFormName() {return this.registrationForm.get('name');}

}
