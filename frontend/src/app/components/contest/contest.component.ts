import { Component, OnInit, ViewChild } from '@angular/core';
import { ContestInfo } from 'src/app/entities/contester.entity';
import { Router } from '@angular/router';
import { getDifferenceInSecondsWithoutAbs } from 'src/app/entities/time';
import { ContestProblemComponent } from '../contest-problem/contest-problem.component';
import { ContestService } from 'src/app/services/contest.service';
import { faCropSimple } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  currentProgress = 0;

  // @ViewChild('contestProblem') contestProblemComponent!: ContestProblemComponent;

  private currentDate = new Date();

  private interval: any;

  private upgradeIntervalTicker = 10000 // in mileseconds

  contestInfo: any;

  selectedIndex = 0;

  currentProblem: any;

  problems: any[] = [];

  private _isParticipant = true;

  constructor(
    private router: Router,
    private contestService: ContestService,
    private authService: AuthService,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let splittedUrl = this.router.url.split('/');
    const id = splittedUrl[splittedUrl.length - 1];
    console.log(`id`, id);
    // const begin = new Date(new Date().setMinutes(this.currentDate.getMinutes() - 1));
    // const end = new Date(new Date().setMinutes(this.currentDate.getMinutes() + 1));
    this.contestService.getContestById(id).subscribe((res: any) => {
      this.contestInfo = res[0];

      let isParticipant = false;
      for(let i=0; i<this.contestInfo?.participants?.length; i++) {
        if(this.userService.userInfo._id.toString() == this.contestInfo?.participants[i]?._id.toString()) {
          this._isParticipant = true;
          isParticipant = true;
          break;
        }
      }
      if(!isParticipant) {
        this._isParticipant = false;
      }
      console.log(this.contestInfo);
      this.contestInfo.startDate = new Date(this.contestInfo.startDate);
      this.contestInfo.endDate = new Date(this.contestInfo.endDate);
      this.currentProblem = this.contestInfo.tasks[0]
      this.problems = this.contestInfo.tasks;
      // this.contestProblemComponent.setContestProblems(this.contestInfo.tasks);
      // this.contestProblemComponent.setCurrentProblem(this.contestInfo.tasks[0]);
      this.upgradeIntervalTicker = Math.round(getDifferenceInSecondsWithoutAbs(new Date(this.contestInfo.startDate), new Date(this.contestInfo.endDate)) * 10); // Посчитать размер тика (10 = 0.01(1%) * 1000(милисекунды))

      this.currentProgress = this.getCurrentProgress();
      if (this.currentProgress < 100) {
        this.interval = setInterval(() => {
          this.currentProgress = this.getCurrentProgress();
          if (this.currentProgress >= 100) {
            clearInterval(this.interval);
          }
        }, this.upgradeIntervalTicker);
      }
    })
  }

  getCurrentProgress() {
    const currentDate = new Date();
    const diffStartNow = getDifferenceInSecondsWithoutAbs(this.contestInfo.startDate, currentDate);
    if (diffStartNow < 0) {
      return 0
    }
    const diffStartEnd = getDifferenceInSecondsWithoutAbs(this.contestInfo.startDate, this.contestInfo.endDate);
    return Math.round(diffStartNow / diffStartEnd * 100);
  }

  onDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  openProblem(index: number) {
    this.selectedIndex = 3; // Открыть Problem tab
    this.currentProblem = this.problems[index];
    // this.contestProblemComponent.setCurrentProblem(this.contestProblemComponent.contestProblems[index]);
  }

  get isLoggedIn() { return this.authService.isLoggedIn() }

  get isOwner() { return this.contestInfo?.owner?._id == this.userService.userInfo._id }

  get isStarted() { return this.contestInfo?.startDate < new Date().getTime() }

  get isParticipant() { 
    return this._isParticipant;
  }

  joinContest() {
    this.contestService.joinContest(this.contestInfo._id.toString()).subscribe((res) => {
      this._isParticipant = true;
      this.snackBarService.openSuccessSnackBar("Joined to contest successfully", 5000);
    })
  }

}
