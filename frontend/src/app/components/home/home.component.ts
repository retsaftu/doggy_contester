import { Component, OnInit, ViewChild } from '@angular/core';
import { ContestInfo } from '../../entities/contester.entity';
import {MatDialog} from '@angular/material/dialog';
import { CreateContestComponent } from '../create-contest/create-contest.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private snackBarService: SnackBarService, private authService: AuthService) { }

  private currentDate = new Date();

  userContests: ContestInfo[] = [
    new ContestInfo(
      7,
      "Contest 7",
      50,
      "Username1",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours()))
    )
  ]

  activeContests: ContestInfo[] = [
    new ContestInfo(
      6,
      "Contest 6",
      50,
      "Username1",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
    new ContestInfo(
      7,
      "Contest 7",
      100,
      "Username2",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
    new ContestInfo(
      8,
      "Contest 8",
      1000,
      "Username3",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
  ]

  contests: ContestInfo[] = [
    new ContestInfo(
      1,
      "Contest 1",
      50,
      "Username1",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
    new ContestInfo(
      2,
      "Contest 2",
      100,
      "Username2",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
    new ContestInfo(
      3,
      "Contest 3",
      1000,
      "Username3",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
    new ContestInfo(
      4,
      "Contest 4",
      20,
      "Username4",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
    new ContestInfo(
      5,
      "Contest 5",
      5,
      "Username5",
      new Date(),
      new Date(this.currentDate.setHours(this.currentDate.getHours() + 3))
    ),
  ]

  ngOnInit(): void {
  }

  openCreateContestDialog() {
    this.dialog.open(CreateContestComponent, {
      width: '40%'
    });
  }

}
