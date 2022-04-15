import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContestService } from 'src/app/services/contest.service';
import { ContestSubmissionComponent } from '../contest-submission.component';

@Component({
  selector: 'app-submission-dialog',
  templateUrl: './submission-dialog.component.html',
  styleUrls: ['./submission-dialog.component.css']
})
export class SubmissionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ContestSubmissionComponent>,
    private contestService: ContestService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  submissionId = ''

  code = '';

  fileName = '';

  submissionTime!: Date;

  ngOnInit(): void {
    this.submissionId = this.data.submissionId;
    this.contestService.getSubmission(this.submissionId).subscribe((res: any) => {
      console.log(res);
      this.code = res.file;
      this.fileName = res.originalName;
      this.submissionTime = res.timestamp;
    })
  }

}
