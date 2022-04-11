import { Component, OnInit, ViewChild } from '@angular/core';
import { ContestInfo } from '../../entities/contester.entity';
import { MatDialog } from '@angular/material/dialog';
import { CreateContestComponent } from '../create-contest/create-contest.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContestService } from 'src/app/services/contest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private snackBarService: SnackBarService,
     private contestService: ContestService, private authService: AuthService) { }

  private currentDate = new Date();

  userContests: ContestInfo[] = [];

  activeContests: ContestInfo[] = [];

  contests: ContestInfo[] = [];

  // userContests: ContestInfo[] = [
  //   new ContestInfo(
  //     7,
  //     "Contest 7",
  //     50,
  //     "Username1",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours()))
  //   )
  // ]

  // activeContests: ContestInfo[] = [
  //   new ContestInfo(
  //     6,
  //     "Contest 6",
  //     50,
  //     "Username1",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  //   new ContestInfo(
  //     7,
  //     "Contest 7",
  //     100,
  //     "Username2",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  //   new ContestInfo(
  //     8,
  //     "Contest 8",
  //     1000,
  //     "Username3",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  // ]

  // contests: ContestInfo[] = [
  //   new ContestInfo(
  //     1,
  //     "Contest 1",
  //     50,
  //     "Username1",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  //   new ContestInfo(
  //     2,
  //     "Contest 2",
  //     100,
  //     "Username2",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  //   new ContestInfo(
  //     3,
  //     "Contest 3",
  //     1000,
  //     "Username3",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  //   new ContestInfo(
  //     4,
  //     "Contest 4",
  //     20,
  //     "Username4",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  //   new ContestInfo(
  //     5,
  //     "Contest 5",
  //     5,
  //     "Username5",
  //     new Date(),
  //     new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
  //   ),
  // ]

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.contestService.getMyActiveContest().subscribe((res:ContestInfo[]) => {
        console.log('my active anotest', res);
        this.activeContests = res
      })
      this.contestService.getMyContest().subscribe((res: ContestInfo[]) => {
        console.log('my  anotest', res);
        this.userContests = res;
      })
      this.contestService.getCurrentContests().subscribe((res: ContestInfo[]) => {
        console.log('current anotest', res);
        this.contests = res;
      })
    } else {
      this.contestService.getCurrentContestsForUnauthorizedUser().subscribe((res: ContestInfo[]) => {
        this.contests = res;
      })
    }
  }

  openCreateContestDialog() {
    const dialogRef = this.dialog.open(CreateContestComponent, {
      width: '40%'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res?.created) {
        this.contestService.getMyContest().subscribe((res: ContestInfo[]) => {
          this.userContests = res;
        })
      }
    })
  }

  get isLoggedIn() { return this.authService.isLoggedIn() }

}
