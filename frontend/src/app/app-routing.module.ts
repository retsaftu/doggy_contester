import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component'
import { ContestComponent } from './components/contest/contest.component';
import { ContestsComponent } from './components/contests/contests.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
