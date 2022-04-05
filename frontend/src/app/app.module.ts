import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWindowClose, faComment, faAngleUp, faAngleDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { environment } from 'src/environments/environment';

import { AuthComponent } from './components/auth/auth.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ApiInterceptorInterceptor } from './interceptors/api-interceptor.interceptor';
import { HomeComponent } from './components/home/home.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MainComponent } from './components/main/main.component';
import { ContestItemComponent } from './components/contest-item/contest-item.component';
import { ContestComponent } from './components/contest/contest.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { InputNumberComponent } from './components/timepicker/input-number/input-number.component';
import { TimepickerDialogComponent } from './components/timepicker/timepicker-dialog/timepicker-dialog.component';
import { TimepickerInputComponent } from './components/timepicker/timepicker-input/timepicker-input.component';
import { ContestsComponent } from './components/contests/contests.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NotificationComponent,
    HomeComponent,
    NavigationComponent,
    MainComponent,
    ContestItemComponent,
    ContestComponent,
    CreateContestComponent,
    InputNumberComponent,
    TimepickerDialogComponent,
    TimepickerInputComponent,
    ContestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SocialLoginModule,
    FontAwesomeModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatMomentDateModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatPaginatorModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientID)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(faWindowClose, faComment, faAngleUp, faAngleDown, faPlus, faMinus);
  }
}
