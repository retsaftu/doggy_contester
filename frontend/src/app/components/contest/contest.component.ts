import { Component, OnInit, ViewChild } from '@angular/core';
import { ContestInfo } from 'src/app/entities/contester.entity';
import { Router } from '@angular/router';
import { getDifferenceInSecondsWithoutAbs } from 'src/app/entities/time';
import { ContestProblemComponent } from '../contest-problem/contest-problem.component';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  currentProgress = 0;

  @ViewChild('contestProblem') contestProblemComponent!: ContestProblemComponent;

  private currentDate = new Date();

  private interval: any;

  private upgradeIntervalTicker = 10000 // in mileseconds

  contestInfo!: ContestInfo;

  selectedIndex = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    let splittedUrl = this.router.url.split('/');
    const id = parseInt(splittedUrl[splittedUrl.length - 1]);
    const begin = new Date(new Date().setMinutes(this.currentDate.getMinutes() - 1));
    const end = new Date(new Date().setMinutes(this.currentDate.getMinutes() + 1));
    // this.contestInfo = new ContestInfo(id, "Contest name", 50, "Username1", begin, end);

    this.upgradeIntervalTicker = Math.round(getDifferenceInSecondsWithoutAbs(this.contestInfo.startDate, this.contestInfo.endDate) * 10); // Посчитать размер тика (10 = 0.01(1%) * 1000(милисекунды))

    this.currentProgress = this.getCurrentProgress();
    if (this.currentProgress < 100) {
      this.interval = setInterval(() => {
        this.currentProgress = this.getCurrentProgress();
        if (this.currentProgress >= 100) {
          clearInterval(this.interval);
        }
      }, this.upgradeIntervalTicker);
    }
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
    this.contestProblemComponent.currentProblem = this.contestProblemComponent.contestProblems[index];
  }

}
