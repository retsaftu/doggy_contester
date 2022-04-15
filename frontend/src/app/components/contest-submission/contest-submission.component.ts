import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AvailableProgrammingLanguages, ContestInfo, SubmissionInfo, SubmissionResult } from 'src/app/entities/contester.entity';
import { getDifferenceInDays, getDifferenceInHours, getDifferenceInMinutes, getDifferenceInSeconds } from 'src/app/entities/time';
import { ContestService } from 'src/app/services/contest.service';
import { SubmissionDialogComponent } from './submission-dialog/submission-dialog.component';

@Component({
  selector: 'app-contest-submission',
  templateUrl: './contest-submission.component.html',
  styleUrls: ['./contest-submission.component.css']
})
export class ContestSubmissionComponent implements OnInit {

  @Input() contestInfo!: ContestInfo;

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20];

  possibleStatuses = SubmissionResult;

  displayedColumns = ['number', 'problemTitle', 'result', 'language', 'submitTime']

  submissions: SubmissionInfo[] = [];

  constructor(
    private contestService: ContestService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.length = 100;
    this.submissions = this.generateList(0, this.pageSize);
  }

  generateList(start: number, end: number) {
    const submission: SubmissionInfo[] = [];
    for(let i=start; i<end; i++) {
      let random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
      const language = random == 1 ? AvailableProgrammingLanguages.CPP : random == 2 ? AvailableProgrammingLanguages.PY : AvailableProgrammingLanguages.JS;
      random = Math.floor(Math.random() * (5 - 1 + 1)) + 1
      const match = [
        SubmissionResult.ACCEPTED,
        SubmissionResult.MEMMORY_LIMIT,
        SubmissionResult.RUNTIM_ERROR,
        SubmissionResult.TIME_LIMIT,
        SubmissionResult.WRONG_ANSWARE
      ]
      const submissionResult = match[random-1];
      random = Math.floor(Math.random() * (5 - 1 + 1)) + 1
      const match2 = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G'
      ]
      submission.push(new SubmissionInfo(match2[random-1], 'Some problem ' + i, submissionResult, language, new Date()))
    }
    return submission;
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
    this.submissions = this.generateList(event.pageIndex * this.pageSize, (event.pageIndex + 1) * this.pageSize);
  }

  open(row: any) {

    const dialogRef = this.dialog.open(SubmissionDialogComponent, {
      width: '60%',
      data: {
        submissionId: "62563d2b90017acbc99c3326"
      }
    })
  }

}
