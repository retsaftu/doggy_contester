import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { ContestCreation, ContestInfo } from '../entities/contester.entity';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  constructor(
    private http: HttpClient,
  ) { }

  getContest(): any {
    return this.http.get('/api/contest');
  }

  getContestById(contestId: string): any {
    return this.http.get(`/api/contest/${contestId}`)
    // .pipe(
    //   map((response: any) => {
    //     console.log(response);
    //     const contestItems: ContestInfo[] = [];
    //     for(let i = 0; i<response.length; i++) {
    //       const contestItem = response[i];
    //       contestItems.push(new ContestInfo(contestItem._id, contestItem.name, contestItem.total_participants,
    //                         contestItem.owner, contestItem.startDate, contestItem.endDate))
    //     }
    //     return contestItems;
    //   })
    // );
  }

  getMyContest(): any {
    return this.http.get('/api/contest/myContests')
      .pipe(
        map((response: any) => {
          console.log(response);
          const contestItems: ContestInfo[] = [];
          for(let i = 0; i<response.length; i++) {
            const contestItem = response[i];
            contestItems.push(new ContestInfo(contestItem._id, contestItem.name, contestItem.total_participants,
                              contestItem.owner, contestItem.startDate, contestItem.endDate))
          }
          return contestItems;
        })
      );
  }

  getMyActiveContest(): any {
    return this.http.get('/api/contest/myActiveContests')
    .pipe(
      map((response: any) => {
        const contestItems: ContestInfo[] = [];
        for(let i = 0; i<response.length; i++) {
          const contestItem = response[i];
          contestItems.push(new ContestInfo(contestItem._id, contestItem.name, contestItem.total_participants,
                            contestItem.owner, contestItem.startDate, contestItem.endDate))
        }
        return contestItems;
      })
    )
  }

  getCurrentContests(): any {
    return this.http.get('/api/contest/currentContests')
      .pipe(
        map((response: any) => {
          const contestItems: ContestInfo[] = [];
          for(let i = 0; i<response.length; i++) {
            const contestItem = response[i];
            contestItems.push(new ContestInfo(contestItem._id, contestItem.name, contestItem.total_participants,
                              contestItem.owner, contestItem.startDate, contestItem.endDate))
          }
          return contestItems;
        })
      );
  }

  getCurrentContestsForUnauthorizedUser(): any {
    return this.http.get('/api/contest/currentContestsForUnauthorizedUser')
    .pipe(
      tap((response: any) => {
        console.log('TAP', response)
        const contestItems: ContestInfo[] = [];
        for(let i = 0; i<response.length; i++) {
          const contestItem = response[i];
          contestItems.push(new ContestInfo(contestItem._id, contestItem.name, contestItem.total_participants,
                            contestItem.owner, contestItem.startDate, contestItem.endDate))
        }
        return contestItems;
      })
    ); 
  }

  createContest(contest: ContestCreation) {
    return this.http.post('/api/contest', contest)
  }

  joinContest(contestId: string) {
    return this.http.patch(`/api/contest/joinContest/${contestId}`, null);
  }

  getSubmission(submissionId: string) {
    return this.http.get(`/api/submission/${submissionId}`)
  }

  getSubmissions(contestId: string) {
    let params = new HttpParams().set("contestId", contestId);
    return this.http.get(`/api/leaderboard`, {params})
  }

}
