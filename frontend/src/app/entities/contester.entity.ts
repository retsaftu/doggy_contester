export class ContestInfo {
    id: number;
    contestTitle: string;
    numberOfParticipants: number;
    ownerUsername: string;
    startDate: Date;

    constructor(id: number, contestTitle: string, numberOfParticipants: number, ownerUsername: string, startDate: Date) {
        this.id = id;
        this.contestTitle = contestTitle;
        this.numberOfParticipants = numberOfParticipants;
        this.ownerUsername = ownerUsername;
        this.startDate = startDate;
    }
}

export class Time {

    private _hours: string = '00';
    private _minutes: string = '00';
  
    constructor(hours: string, minutes: string) {
      this.hours = hours;
      this.minutes = minutes;
    }
  
    set hours(hours: string) {
      this._hours = hours.length <= 1 ? '0' + hours : hours;
    }
  
    set minutes(minutes: string) {
      this._minutes = minutes.length <= 1 ? '0' + minutes : minutes;
    }
  
    get hours() {
      return this._hours;
    }
  
    get minutes() {
      return this._minutes;
    }
  
}

export class ContestCreation {

    private _name!: string;
    private _startTime!: Date;
    private _endTime!: Date;
    private _problems!: ProblemCreation[];

    constructor(name: string, duration: Time, time: Time, date: Date, problems: ProblemCreation[]) {
        this._name = name;
        this._problems = problems;
        this._startTime = this.getStartTime(time, date);
        this._endTime = this.getEndTime(time, duration, date);
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

}

export class TestCreation {
    constructor(public testInput: string, public testOutput: string) {}
}

export class ProblemCreation {
    constructor(public problemName: string, public problemDescription: string, 
                public sampleInput: string, public sampleOutput: string,
                public memmoryLimit: number, public timeLimit: number,
                public tests: TestCreation[]) {
                    
    }
}