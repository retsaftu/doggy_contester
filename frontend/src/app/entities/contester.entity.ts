
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
  _id: string;
  name: string;
  total_participants: number;
  owner: Owner;
  startDate: Date;
  endDate: Date;
  duration!: string;

  constructor(_id: string, name: string, total_participants: number, owner: Owner, startDate: Date, endDate: Date) {
    this._id = _id;
    this.name = name;
    this.total_participants = total_participants;
    this.owner = owner;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
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

  private name!: string;
  private startDate!: Date;
  private endDate!: Date;
  private tasks!: ProblemCreation[];
  private description!: string;
  private total_participants!: number;
  private premium!: boolean;
  private price!: number;


  constructor(name: string, description: string, premium: boolean, price: number, duration: Time, time: Time, date: Date,
    total_participants: number, tasks: ProblemCreation[]) {
    this.name = name;
    this.tasks = tasks;
    this.premium = premium
    this.price = price
    this.startDate = this.getStartTime(time, date);
    this.endDate = this.getEndTime(time, duration, date);
    this.description = description;
    this.total_participants = total_participants;
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

}

// Model to create test
export class TestCreation {
  constructor(public input: string, public output: string) { }
}

// Model to create test
export class ProblemCreation {

  constructor(public name: string, public description: string,
    public inputExample: string, public outputExample: string,
    public memory: string, public time: string,
    public tests: TestCreation[], public index: string, public code?: string) {

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