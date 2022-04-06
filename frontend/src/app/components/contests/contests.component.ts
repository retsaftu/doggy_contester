import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ContestInfo } from 'src/app/entities/contester.entity';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css']
})
export class ContestsComponent implements OnInit {

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25];

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  contests: ContestInfo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.contests = this.generateList(0, this.pageSize);
    this.length = 100;
  }

  generateList(start: number, end: number) {
    const contests: ContestInfo[] = [];
    for(let i=start; i<end; i++) {
      contests.push(new ContestInfo(i, "Contest " + i, 50, "Username" + i, new Date(), new Date(new Date().setHours(new Date().getHours() + i + 1))))
    }
    return contests;
  }

  changePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.contests = this.generateList(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

}
