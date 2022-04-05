import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ContestInfo, ProblemStatus } from 'src/app/entities/contester.entity';
import { LeaderboardProblemInfo, LeaderboardUserInfo} from 'src/app/entities/contester.entity';
import { getDifferenceInDays, getDifferenceInHours, getDifferenceInMinutes, getDifferenceInSeconds } from 'src/app/entities/time';

@Component({
  selector: 'app-contest-leaderboard',
  templateUrl: './contest-leaderboard.component.html',
  styleUrls: ['./contest-leaderboard.component.css']
})
export class ContestLeaderboardComponent implements OnInit {


  @Input() contestInfo!: ContestInfo;

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];

  possibleStatuses = ProblemStatus;

  problemsNumber = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  displayedColumns = ['rank', 'username', 'solved']

  leaderBoardInfo: LeaderboardUserInfo[] = []

  private defaultUsers = [
    new LeaderboardUserInfo(1, "Username1", [
      new LeaderboardProblemInfo('A', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('B', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('C', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('D', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('E', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('F', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('G', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('H', new Date(), ProblemStatus.ACCEPTED),
    ]),
    new LeaderboardUserInfo(2, "Username2", [
      new LeaderboardProblemInfo('A', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('B', new Date(), ProblemStatus.FAIL),
      new LeaderboardProblemInfo('C', undefined, ProblemStatus.NOT_SOLVED),
      new LeaderboardProblemInfo('D'),
      new LeaderboardProblemInfo('E', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('F', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('G', new Date(), ProblemStatus.ACCEPTED),
      new LeaderboardProblemInfo('H', new Date(), ProblemStatus.ACCEPTED),
    ])
  ]

  constructor() { }

  ngOnInit(): void {
    this.leaderBoardInfo = this.generateList(0, this.pageSize);
    this.leaderBoardInfo.shift();
    this.leaderBoardInfo.shift();
    this.leaderBoardInfo.unshift(this.defaultUsers[1]);
    this.leaderBoardInfo.unshift(this.defaultUsers[0]);
    this.length = 100;
    this.displayedColumns = this.displayedColumns.concat(this.problemsNumber)
  }

  generateList(start: number, end: number) {
    const users: LeaderboardUserInfo[] = [];
    for(let i=start; i<end; i++) {
      const problems: LeaderboardProblemInfo[] = [];
      for(let j =0; j<this.problemsNumber.length; j++) {
        const random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        const status = random == 1 ? ProblemStatus.ACCEPTED : random == 2 ? ProblemStatus.NOT_SOLVED : ProblemStatus.FAIL;
        const date = random == 2 ? undefined : new Date();
        problems.push(new LeaderboardProblemInfo(this.problemsNumber[j], date, status));
      }
      users.push(new LeaderboardUserInfo(i, "User " + i, problems));
    }
    return users;
  }

  getSubmitTime(submitedTime?: Date) {
    if(!submitedTime) {
      return '';
    }
    let submitedTimeStr = '';
    let result = getDifferenceInDays(this.contestInfo.startDate, this.contestInfo.endDate);
    // Если контест идет больше одного дня
    if(result > 0) {
      result = getDifferenceInDays(this.contestInfo.startDate, submitedTime);
      submitedTimeStr += result < 10 ? '0' + result : result;
    }
    result = getDifferenceInHours(this.contestInfo.startDate, this.contestInfo.endDate);
    // Если контест идет больше одного часа
    if(result > 0) {
      result = getDifferenceInHours(this.contestInfo.startDate, submitedTime);
      submitedTimeStr += (submitedTimeStr.length > 0 ? ' : ' : '') + (result < 10 ? '0' + result : result);
    }
    result = getDifferenceInMinutes(this.contestInfo.startDate, submitedTime);
    submitedTimeStr += (submitedTimeStr.length > 0 ? ' : ' : '') + (result < 10 ? '0' + result : result) + ' : ';
    result = getDifferenceInSeconds(this.contestInfo.startDate, submitedTime);
    submitedTimeStr += result < 10 ? '0' + result : result;
    return submitedTimeStr
  }

  changePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.leaderBoardInfo = this.generateList(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

}
