import { Component, Input, OnInit } from '@angular/core';
import { ContestInfo } from 'src/app/entities/contester.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contest-item',
  templateUrl: './contest-item.component.html',
  styleUrls: ['./contest-item.component.css']
})
export class ContestItemComponent implements OnInit {

  @Input() contestInfo?: ContestInfo;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  enterContest() {
    this.router.navigate([`/contest/${this.contestInfo?.id}`])
  }

}
