import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContestInfo, ContestProblem, ProblemStatus } from 'src/app/entities/contester.entity';

@Component({
  selector: 'app-contest-problems',
  templateUrl: './contest-problems.component.html',
  styleUrls: ['./contest-problems.component.css']
})
export class ContestProblemsComponent implements OnInit {

  @Input() contestInfo!: any;

  @Output() problemIndexToOpenEvent = new EventEmitter<number>();

  possibleStatuses = ProblemStatus;

  problems:any[] = []

  displayedColumns: string[] = ['status', 'number', 'title', 'acceptance'];

  constructor() { }

  ngOnInit(): void {
    // console.log('contestInfo', this.contestInfo);
  }

  ngOnChanges() {
    console.log('contestInfo', this.contestInfo);
    this.problems = this.contestInfo?.tasks;
    console.log('problems', this.problems);
  }

  getAcceptance(value: number | null | undefined) { return !value ? 0 : value }

  openProblem(problemIndex: number) {
    this.problemIndexToOpenEvent.emit(problemIndex);
  }

}
