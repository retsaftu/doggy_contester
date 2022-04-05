import { Component, OnInit, ViewChild } from '@angular/core';
import { ContestInfo } from '../../entities/contester.entity';
import {MatDialog} from '@angular/material/dialog';
import { CreateContestComponent } from '../create-contest/create-contest.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  userContests: ContestInfo[] = [
    {
      id: 7,
      contestTitle: "Contest 7",
      numberOfParticipants: 50,
      ownerUsername: "Username1",
      startDate: new Date()
    },
  ]

  activeContests: ContestInfo[] = [
    {
      id: 6,
      contestTitle: "Contest 6",
      numberOfParticipants: 50,
      ownerUsername: "Username1",
      startDate: new Date()
    },
    {
      id: 7,
      contestTitle: "Contest 7",
      numberOfParticipants: 100,
      ownerUsername: "Username2",
      startDate: new Date()
    },
    {
      id: 8,
      contestTitle: "Contest 8",
      numberOfParticipants: 1000,
      ownerUsername: "Username3",
      startDate: new Date()
    },
  ]

  contests: ContestInfo[] = [
    {
      id: 1,
      contestTitle: "Contest 1",
      numberOfParticipants: 50,
      ownerUsername: "Username1",
      startDate: new Date()
    },
    {
      id: 2,
      contestTitle: "Contest 2",
      numberOfParticipants: 100,
      ownerUsername: "Username2",
      startDate: new Date()
    },
    {
      id: 3,
      contestTitle: "Contest 3",
      numberOfParticipants: 1000,
      ownerUsername: "Username3",
      startDate: new Date()
    },
    {
      id: 4,
      contestTitle: "Contest 4",
      numberOfParticipants: 20,
      ownerUsername: "Username4",
      startDate: new Date()
    },
    { 
      id: 5,
      contestTitle: "Contest 5",
      numberOfParticipants: 5,
      ownerUsername: "Username5",
      startDate: new Date()
    },
  ]

  ngOnInit(): void {
  }

  openCreateContestDialog() {
    this.dialog.open(CreateContestComponent, {
      width: '40%'
    });
  }

}
