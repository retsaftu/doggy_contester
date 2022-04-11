export function getDifferenceInDays(date1: Date, date2: Date) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }
  
export function getDifferenceInHours(date1: Date, date2: Date) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffInMs / (1000 * 60 * 60) % 24);
  }
  
export function getDifferenceInMinutes(date1: Date, date2: Date) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffInMs / (1000 * 60)) % 60;
}

export function getDifferenceInSeconds(date1: Date, date2: Date) {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffInMs / 1000 % 60);
}

  /**
   * @param date1 have to be more than date2
   * @param date2 have to be less than date1
   * @returns difference in seconds
   */
export function getDifferenceInSecondsWithoutAbs(date1: Date, date2: Date) {
    const diffInMs = date2.getTime() - date1.getTime();
    return diffInMs / 1000;
}

export class Time {

    private _hours: string = '00';
    private _minutes: string = '00';
    public isTime: boolean = true;

    constructor(hours: string, minutes: string,  isTime?: boolean) {
      this.hours = hours;
      this.minutes = minutes;
      if(isTime == false) {
        this.isTime = isTime;
      }
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
