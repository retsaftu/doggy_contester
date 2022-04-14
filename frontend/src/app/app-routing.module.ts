import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component'
import { ContestComponent } from './components/contest/contest.component';
import { ContestsComponent } from './components/contests/contests.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './guards/auth.guard';
import { SettingsMainPageComponent } from './components/settings-page/settings-main-page/settings-main-page.component';
import { SettingsPublicProfileComponent } from './components/settings-page/settings-public-profile/settings-public-profile.component';
import { SettingsAppearanceComponent } from './components/settings-page/settings-appearance/settings-appearance.component';
import { SettingsEmailComponent } from './components/settings-page/settings-email/settings-email.component';
import { SettingsPasswordComponent } from './components/settings-page/settings-password/settings-password.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { Page404Component } from './components/page404/page404.component';
import { BalanceComponent } from './components/balance/balance.component';

const routes: Routes = [
  { 
    path: 'auth', 
    component: AuthComponent,
  },
  {
    path: 'auth/confirm',
    component: ConfirmEmailComponent
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'contest/:id',
        component: ContestComponent
      },
      {
        path: 'contests',
        component: ContestsComponent
      },
      {
        path: 'leaderboard',
        component: LeaderboardComponent
      },
      {
        path: 'user/:id',
        component: UserComponent
      },
      {
        path: 'balance',
        component: BalanceComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: '',
        component: SettingsMainPageComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'settings/proflie',
            component: SettingsPublicProfileComponent
          },
          {
            path: 'settings/appearance',
            component: SettingsAppearanceComponent
          },
          {
            path: 'settings/email',
            component: SettingsEmailComponent
          },
          {
            path: 'settings/password',
            component: SettingsPasswordComponent
          }
        ]
      },
      {
        path: "**",
        component: Page404Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
