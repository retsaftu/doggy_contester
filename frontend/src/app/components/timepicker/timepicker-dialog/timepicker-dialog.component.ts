import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MainComponent } from '../../main/main.component';
import { Time } from 'src/app/entities/time';

@Component({
  selector: 'app-timepicker-dialog',
  templateUrl: './timepicker-dialog.component.html',
  styleUrls: ['./timepicker-dialog.component.css']
})
export class TimepickerDialogComponent implements OnInit {

  hours = 0;
  minutes = 0;
  time = new Time('00', '00');

  constructor(
    public dialogRef: MatDialogRef<MainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Time,
  ) { }

  ngOnInit(): void {
    this.hours = parseInt(this.data.hours);
    this.minutes = parseInt(this.data.minutes);
    this.time.hours = this.data.hours;
    this.time.minutes = this.data.minutes;
  }

  changeHours(event: any) {
    // console.log(event)
    // if(event.toString().length <= 1) {
    //   this.time.hours = '0' + event;
    // }
    this.time.hours = event.toString();
  }

  changeMinutes(event: any) {
    // console.log(event);
    // if(event.toString().length <= 1) {
    //   this.time.minutes = '0' + event;
    //   return;
    // }
    this.time.minutes = event.toString();
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
