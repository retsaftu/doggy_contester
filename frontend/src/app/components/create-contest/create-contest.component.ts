import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {FormArray, FormControl, FormGroup, Validators, FormBuilder, AbstractControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { TimepickerInputComponent } from '../timepicker/timepicker-input/timepicker-input.component';
import { ContestCreation, ContestInfo, ProblemCreation, TestCreation } from 'src/app/entities/contester.entity';
import { Time } from 'src/app/entities/time';
import { TimepickerDialogComponent } from '../timepicker/timepicker-dialog/timepicker-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import { ContestService } from 'src/app/services/contest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { HomeComponent } from '../home/home.component';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CreateContestComponent implements OnInit {

  form: FormGroup;

  @ViewChild('timeinput') timeinput!: TimepickerInputComponent;
  @ViewChild('durationinput') durationinput!: TimepickerInputComponent;

  private _isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<HomeComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder, 
    private contestService: ContestService,
    private snackBarService: SnackBarService) { 
    this.form = fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      time: new FormControl(new Time('00', '00'), [Validators.required]),
      duration: new FormControl(new Time('01', '00'), [Validators.required]),
      date: new FormControl(moment(), [Validators.required]),
      total_participants: new FormControl(50, [Validators.required]),
      problems: fb.array([
        new FormGroup({
          name: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          sampleTestInput: new FormControl('', [Validators.required]),
          sampleTestOutput: new FormControl('', [Validators.required]),
          memmoryLimit: new FormControl(1),
          timeLimit: new FormControl(1000),
          tests: fb.array([
            new FormGroup({
              testInput: new FormControl('', [Validators.required]),
              testOutput: new FormControl('', [Validators.required])
            })
          ]),
          code: new FormControl(''),
        }) 
      ])
    })
  }

  ngOnInit(): void {
  }

  openTimepicker() {
    const dialogRef = this.dialog.open(TimepickerDialogComponent, {
      width: '20%',
      data: this.form.value.time,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.form.get('time')?.setValue(result);
      this.timeinput.value = result;
    });
  }

  openDurationpicker() {
    const dialogRef = this.dialog.open(TimepickerDialogComponent, {
      width: '20%',
      data: {
        hours: this.form.value.duration.hours,
        minutes: this.form.value.duration.minutes,
        isTime: false
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.durationinput.value = result;
      this.form.get('duration')?.setValue(result);
    });
  }

  get problems() {
    return this.form.get('problems') as FormArray;
  }

  getProblem(probelmIndex: number) {
    return this.problems.at(probelmIndex);
  }

  getNumberOfProblems() {
    return this.problems.length;
  }

  formatProblemIndex(index: number) {
    return String.fromCharCode(index + 65);
  }

  createNewProblem() {
    const problem = this.fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      sampleTestInput: new FormControl('', [Validators.required]),
      sampleTestOutput: new FormControl('', [Validators.required]),
      memmoryLimit: new FormControl(1),
      timeLimit: new FormControl(1000),
      tests: this.fb.array([
        new FormGroup({
          testInput: new FormControl('', [Validators.required]),
          testOutput: new FormControl('', [Validators.required])
        })
      ]),
      code: new FormControl('')
    })

    this.problems.push(problem);
  }

  deleteProblem(index: number) {
    this.problems.removeAt(index);
  }

  getTests(problemIndex: number) {
    return (this.problems.get(problemIndex.toString()) as FormGroup).get('tests') as FormArray;
  }

  getTest(problemIndex: number, testIndex: number) {
    return this.getTests(problemIndex).at(testIndex);
  }

  getNumberOfTests(problemIndex: number) {
    return this.getTests(problemIndex).length;
  }

  formatTestIndex(index: number) {
    return index + 1;
  }

  createNewTest(problemIndex: number) {
    const test = this.fb.group({
      testInput: new FormControl('', [Validators.required]),
      testOutput: new FormControl('', [Validators.required])
    })
    this.getTests(problemIndex).push(test)
  }

  deleteTest(probelmIndex: number, testIndex: number) {
    this.getTests(probelmIndex).removeAt(testIndex);
  }

  private isProblemValid(problemIndex: number) {
    const problem = this.getProblem(problemIndex);
    return !problem.get('name')?.hasError('required') && !problem.get('description')?.hasError('required') &&
           !problem.get('sampleTestInput')?.hasError('required') && !problem.get('sampleTestOutput')?.hasError('required') &&
           !problem.get('memmoryLimit')?.hasError('required') && !problem.get('timeLimit')?.hasError('required');
  }

  private isTestValid(problemIndex: number, testIndex: number) {
    const test = this.getTest(problemIndex, testIndex);
    return !test.get('testInput')?.hasError('require') && !test.get('testOutput')?.hasError('required');
  }

  isAllContestFieldsAreValid() {
    // Validate general contest fields
    if(this.name?.hasError('required') || this.duration?.hasError('required') ||
       this.time?.hasError('required') || this.date?.hasError('required') || 
       this.total_participants?.hasError('required') || this.description?.hasError('required')) {
      return false;
    }

    // Validate problems fields
    for(let i = 0; i<this.problems.length; i++) {

      if(!this.isProblemValid(i)) { return false; }

      // Validate tests
      for(let j=0; j<this.getTests(i).length; j++) {
        if(!this.isTestValid(i, j)) { return false; }
      }
    }
    return true;
  }

  private disableTestFields(problemIndex: number, testIndex: number) {
    const test = this.getTest(problemIndex, testIndex);
    test.get('testInput')?.disable();
    test.get('testOutput')?.disable();
  }

  private disableProblemFields(problemIndex: number) {
    const problem = this.getProblem(problemIndex);
    problem.get('name')?.disable();
    problem.get('description')?.disable();
    problem.get('name')?.disable();
    problem.get('description')?.disable();
    problem.get('sampleTestInput')?.disable()
    problem.get('sampleTestOutput')?.disable() &&
    problem.get('memmoryLimit')?.disable()
    problem.get('timeLimit')?.disable()
  }

  private disableContestFields() {
    this.name?.disable();
    this.duration?.disable();
    this.time?.disable();
    this.date?.disable();
    this.total_participants?.disable();
    this.description?.disable();
    for(let i = 0; i<this.problems.length; i++) {
      this.disableProblemFields(i);
      for(let j=0; j<this.getTests(i).length; j++) {
        this.disableTestFields(i, j);
      }
    }
    
  }
  
  private enableTestFields(problemIndex: number, testIndex: number) {
    const test = this.getTest(problemIndex, testIndex);
    test.get('testInput')?.enable();
    test.get('testOutput')?.enable();
  }

  private enableProblemFields(problemIndex: number) {
    const problem = this.getProblem(problemIndex);
    problem.get('name')?.enable();
    problem.get('description')?.enable();
    problem.get('name')?.enable();
    problem.get('description')?.enable();
    problem.get('sampleTestInput')?.enable()
    problem.get('sampleTestOutput')?.enable() &&
    problem.get('memmoryLimit')?.enable()
    problem.get('timeLimit')?.enable()
  }

  private enableContestFields() {
    this.name?.enable();
    this.duration?.enable();
    this.time?.enable();
    this.date?.enable();
    this.total_participants?.enable();
    this.description?.enable();
    for(let i = 0; i<this.problems.length; i++) {
      this.enableProblemFields(i);
      for(let j=0; j<this.getTests(i).length; j++) {
        this.enableTestFields(i, j);
      }
    }
    
  }

  createContest() {

    if(!this.isAllContestFieldsAreValid()) {
      return
    }

    const problems: ProblemCreation[] = [];

    for(let i = 0; i<this.problems.length; i++) {
      const problem = this.getProblem(i);
      const name = problem.get('name')?.value;
      const description = problem.get('description')?.value;
      const sampleTestInput = problem.get('sampleTestInput')?.value;
      const sampleTestOutput = problem.get('sampleTestOutput')?.value;
      const memmoryLimit = problem.get('memmoryLimit')?.value.toString();
      const timeLimit = problem.get('timeLimit')?.value.toString();
      const code = problem.get('code')?.value;

      const tests: TestCreation[] = [];

      for(let j=0; j<this.getTests(i).length; j++) {
        const testInput = this.getTest(i, j).get('testInput')?.value;
        const testOutput = this.getTest(i, j).get('testOutput')?.value;
        tests.push(new TestCreation(testInput, testOutput))
      }
      problems.push(new ProblemCreation(name, description, sampleTestInput, sampleTestOutput, memmoryLimit, timeLimit, tests, this.formatProblemIndex(i), code))
    }
    const name = this.name?.value;
    const description = this.description?.value;
    const duration = this.duration?.value;
    const time = this.time?.value;
    const date = this.date?.value?.toDate();
    const total_participants = this.total_participants?.value;

    const contest = new ContestCreation(name, description, duration, time, date, total_participants, problems);

    console.log(contest);

    this.contestService.createContest(contest).subscribe(({
      next: (res) => {
        this.snackBarService.openSuccessSnackBar("Contest created succsessfully!");
        this.dialogRef.close({created: true});
      },
      error: (err) => {
        this.enableContestFields();
      }
    }))
  }

  get name() { return this.form.get('name'); }

  get description() { return this.form.get('description'); }

  get duration() { return this.form.get('duration'); }

  get time() { return this.form.get('time'); }

  get date() { return this.form.get('date'); }

  get total_participants() { return this.form.get('total_participants'); }

  get isLoading() { return this._isLoading; }

  set isLoading(value: boolean) {
    this._isLoading = value;
    if(this._isLoading) {
      this.disableContestFields();
    } else {
      this.enableContestFields();
    }
  }

}
