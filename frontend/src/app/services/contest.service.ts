import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContestCreation } from '../entities/contester.entity';

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
    return this.http.get(`/api/contest/${contestId}`);
  }

  getMyContest(): any {
    return this.http.get('/api/contest/myContests');
  }

  getMyActiveContest(): any {
    return this.http.get('/api/contest/myActiveContests');
  }

  getCurrentContests(): any {
    return this.http.get('/api/contest/currentContests');
  }

  createContest(contest: ContestCreation) {
    return this.http.post('/api/contest', contest)
  }

}
