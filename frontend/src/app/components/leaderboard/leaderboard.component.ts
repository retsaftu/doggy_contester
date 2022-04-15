import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UserLeaderboard } from 'src/app/entities/user.entity';
import { UserService } from 'src/app/services/user.service';

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

  displayedColumns = ['rank', 'username', 'name', 'solved', 'attempted']

  userLeaderboard: UserLeaderboard[] = [];

  fullLeaderboard: UserLeaderboard[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.length = 100;
    // this.userLeaderboard = this.generateList(0, this.pageSize);
    this.userService.getGlobalLeaderBoard().subscribe((res: any) => {
      console.log(`res`, res);
      // for (let i = 0; i < res.length; i++) {
      //   console.log(res[i])
      //   this.fullLeaderboard.push(new UserLeaderboard(res[i].username, res[i].name, res[i].solved, res[i].attempted))
      // }
      // for (let i = 0; i < this.pageSize; i++) {
      //   console.log(this.fullLeaderboard[i])
      //   this.userLeaderboard.push(this.fullLeaderboard[i])
      // }
      this.userLeaderboard = res;

    })
  }

  // generateList(start: number, end: number) {
  //   const userLeaderboard: UserLeaderboard[] = [];
  //   for(let i=start; i<end; i++) {
  //     userLeaderboard.push(new UserLeaderboard("Username " + i, "Name " + i, i)); 
  //   }
  //   return userLeaderboard;
  // }

  changePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.userLeaderboard = [];
    for (let i = this.pageSize * this.pageIndex; i < this.pageSize * (this.pageIndex + 1); i++) {
      this.userLeaderboard.push(new UserLeaderboard(this.fullLeaderboard[i].username, this.fullLeaderboard[i].name, this.fullLeaderboard[i].solved, this.fullLeaderboard[i].attempted,))
    }
    // this.userLeaderboard = this.generateList(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

}
