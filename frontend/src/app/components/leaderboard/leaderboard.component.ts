import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
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
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      this.length = res.length;
      this.fullLeaderboard = res;
      const currPage = [];
      for (let i = 0; i < this.pageSize && i < this.fullLeaderboard.length; i++) {
        currPage.push(new UserLeaderboard(this.fullLeaderboard[i]._id, this.fullLeaderboard[i].username, this.fullLeaderboard[i].name, this.fullLeaderboard[i].solved, this.fullLeaderboard[i].attempted,))
      }
      this.userLeaderboard = currPage;
      console.log(this.userLeaderboard)
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
    const currPage = []
    console.log(this.pageSize * this.pageIndex)
    for (let i = this.pageSize * this.pageIndex; i < this.pageSize * (this.pageIndex + 1) && i < this.fullLeaderboard.length; i++) {
      console.log(this.fullLeaderboard[i]);
      currPage.push(new UserLeaderboard(this.fullLeaderboard[i]._id, this.fullLeaderboard[i].username, this.fullLeaderboard[i].name, this.fullLeaderboard[i].solved, this.fullLeaderboard[i].attempted,))
    }
    this.userLeaderboard = currPage;
    // this.userLeaderboard = this.generateList(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

  open(row: any) {
    this.router.navigate([`/user/${row._id}`])
  }

}
