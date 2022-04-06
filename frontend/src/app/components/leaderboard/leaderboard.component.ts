import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UserLeaderboard } from 'src/app/entities/user.entity';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  displayedColumns = ['rank', 'username', 'name', 'solved']

  userLeaderboard: UserLeaderboard[] = [];

  constructor() { }

  ngOnInit(): void {
    this.length = 100;
    this.userLeaderboard = this.generateList(0, this.pageSize);
  }

  generateList(start: number, end: number) {
    const userLeaderboard: UserLeaderboard[] = [];
    for(let i=start; i<end; i++) {
      userLeaderboard.push(new UserLeaderboard("Username " + i, "Name " + i, i)); 
    }
    return userLeaderboard;
  }

  changePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.userLeaderboard = this.generateList(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

}
