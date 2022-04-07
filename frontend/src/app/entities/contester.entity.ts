
import { getDifferenceInDays, getDifferenceInHours, getDifferenceInMinutes, Time } from "./time";

// Basic contest info to display
export class Owner {
  _id: string;

  name: string;

  constructor(_id: string, name: string) {
    this._id = _id;
    this.name = name;
  }
}

export class ContestInfo {
  id: number;
  name: string;
  total_participants: number;
  owner: Owner;
  startDate: Date;
  endDate: Date;
  duration!: string;

  constructor(id: number, name: string, total_participants: number, owner: Owner, startDate: Date, endDate: Date) {
    this.id = id;
    this.name = name;
    this.total_participants = total_participants;
    this.owner = owner;
    this.startDate = startDate;
    this.endDate = endDate;
    this.duration = this.getDuration(this.startDate, this.endDate);
  }

  private normilizeDate(date: Date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  private getPlural(value: number) {
    return value > 1 ? 's' : '';
  }

  private getDuration(date1: Date, date2: Date) {
    date1 = this.normilizeDate(date1);
    date2 = this.normilizeDate(date2);
    let duration = '';
    const days = getDifferenceInDays(date1, date2);
    if (days > 0) {
      duration += (days + ' day' + this.getPlural(days) + ' ');
    }
    const hours = getDifferenceInHours(date1, date2);
    if (hours > 0) {
      duration += (hours + ' hour' + this.getPlural(hours) + ' ');
    }
    const minutes = getDifferenceInMinutes(date1, date2);
    if (minutes > 0) {
      duration += (minutes + ' minutes' + this.getPlural(minutes) + ' ');
    }
    return duration.trim();
  }
}
// Model to create contest
export class ContestCreation {

  private _name!: string;
  private _startTime!: Date;
  private _endTime!: Date;
  private _problems!: ProblemCreation[];
  private _description!: string;
  private _total_participants!: number;
  private _code?: string;

  constructor(name: string, description: string, duration: Time, time: Time, date: Date,
              total_participants: number, problems: ProblemCreation[], code?: string) {
    this._name = name;
    this._problems = problems;
    this._startTime = this.getStartTime(time, date);
    this._endTime = this.getEndTime(time, duration, date);
    this._description = description;
    this._total_participants = total_participants;
    this._code = code;
  }

  private getStartTime(time: Time, date: Date): Date {
    const startTime = new Date();
    startTime.setDate(date.getDate());
    startTime.setHours(parseInt(time.hours));
    startTime.setMinutes(parseInt(time.minutes));
    startTime.setSeconds(0);
    return startTime;
  }

  private getEndTime(time: Time, duration: Time, date: Date): Date {
    const endTime = new Date();
    endTime.setDate(date.getDate());
    endTime.setHours(parseInt(time.hours) + parseInt(duration.hours));
    endTime.setMinutes(parseInt(time.minutes) + parseInt(duration.minutes));
    endTime.setSeconds(0);
    return endTime
  }

  get name() { return this._name; }
  get problems() { return this._problems; }
  get startTime() { return this._startTime; }
  get endTime() { return this._endTime; }
  get description() { return this._description; }
  get total_participants() { return this._total_participants; }
  get code() {return this._code;}

}

// Model to create test
export class TestCreation {
  constructor(public testInput: string, public testOutput: string) { }
}

// Model to create test
export class ProblemCreation {
  constructor(public problemName: string, public problemDescription: string,
    public sampleInput: string, public sampleOutput: string,
    public memmoryLimit: number, public timeLimit: number,
    public tests: TestCreation[]) {

  }
}

export enum ProblemStatus {
  FAIL = 'fail',
  ACCEPTED = 'accepted',
  NOT_SOLVED = 'not_solved',
}

export class ContestProblem {
  constructor(public status: ProblemStatus | undefined | null, public number: string,
    public title: string, public acceptance: number | null | undefined) { }
}

export class LeaderboardProblemInfo {
  constructor(public number: string, public published?: Date, public status?: ProblemStatus | null | undefined) { }
}

export class LeaderboardUserInfo {

  public solved = 0;
  public numberOfProblems!: number;

  constructor(public rank: number, public username: string, public problems: LeaderboardProblemInfo[]) {
    this.numberOfProblems = this.problems.length;
    this.problems.forEach((problem) => {
      this.solved += (problem.status == ProblemStatus.ACCEPTED ? 1 : 0);
    })
  }
}

export enum SubmissionResult {
  ACCEPTED = 'Accepted',
  WRONG_ANSWARE = 'Wrong answare',
  RUNTIM_ERROR = 'Runtime error',
  MEMMORY_LIMIT = 'Memmory limit',
  TIME_LIMIT = 'Time limit'
}

export class SubmissionInfo {
  constructor(public number: string, public problemTitle: string, public submissionResult: SubmissionResult,
    public language: AvailableProgrammingLanguages, public submitTime: Date) { }
}

export enum AvailableProgrammingLanguages {
  CPP = 'C++',
  PY = 'Python',
  JS = 'JavaScript'
}

export enum AvailableProgrammingLanguagesExtension {
  CPP = 'cpp',
  PY = 'py',
  JS = 'JS'
}

export class ProblemContent {
  constructor(public problemName: string, public problemDescription: string,
    public sampleInput: string, public sampleOutput: string,
    public memmoryLimit: number, public timeLimit: number) {
  }
}