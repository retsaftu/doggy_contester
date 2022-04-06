import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContestInfo, ContestProblem, ProblemStatus } from 'src/app/entities/contester.entity';

@Component({
  selector: 'app-contest-problems',
  templateUrl: './contest-problems.component.html',
  styleUrls: ['./contest-problems.component.css']
})
export class ContestProblemsComponent implements OnInit {

  @Input() contestInfo!: ContestInfo;

  @Output() problemIndexToOpenEvent = new EventEmitter<number>();

  possibleStatuses = ProblemStatus;

  problems:ContestProblem[] = [
    new ContestProblem(ProblemStatus.ACCEPTED, 'A', 'Problem 1', 0.788),
    new ContestProblem(ProblemStatus.FAIL, 'B', 'Problem 2', null),
    new ContestProblem(ProblemStatus.NOT_SOLVED, 'C', 'Problem 3', undefined),
    new ContestProblem(null, 'D', 'Problem 4', 0.0),
    new ContestProblem(undefined, 'E', 'Problem 5', 0.788),
    new ContestProblem(ProblemStatus.ACCEPTED, 'F', 'Problem 6', 0.788),
    new ContestProblem(ProblemStatus.ACCEPTED, 'G', 'Problem 7', 0.788),
    new ContestProblem(ProblemStatus.ACCEPTED, 'F', 'Problem 8', 0.788),
  ]

  displayedColumns: string[] = ['status', 'number', 'title', 'acceptance'];

  constructor() { }

  ngOnInit(): void {
  }

  getAcceptance(value: number | null | undefined) { return !value ? 0 : value }

  openProblem(problemIndex: number) {
    this.problemIndexToOpenEvent.emit(problemIndex);
  }

}
