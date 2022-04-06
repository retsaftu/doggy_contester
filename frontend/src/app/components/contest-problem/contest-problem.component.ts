import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemContent } from 'src/app/entities/contester.entity';

@Component({
  selector: 'app-contest-problem',
  templateUrl: './contest-problem.component.html',
  styleUrls: ['./contest-problem.component.css']
})
export class ContestProblemComponent implements OnInit {

  contestId!: number;

  constructor(private router: Router) { }

  contestProblems: ProblemContent[] = [];

  currentProblem!: ProblemContent;

  ngOnInit(): void {
    let splittedUrl = this.router.url.split('/');
    this.contestId = parseInt(splittedUrl[splittedUrl.length - 1]);
    this.contestProblems = this.generationList();
    this.currentProblem = this.contestProblems[0];
  }

  generationList() {
    const problems: ProblemContent[] = [];
    const descriptionTmp = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis tempore velit maxime nemo animi laboriosam illum ullam. Eos fuga ullam blanditiis at dignissimos, beatae architecto ipsa nesciunt necessitatibus numquam nemo!'
    for(let i=0; i<7; i++ ){
      let description = ""
      for(let j=0; j<10; j++) {
        description += descriptionTmp;
      }
      const problem = new ProblemContent("Problem " + i, description, "2\n3 2", "5\n10", 1000, 1);
      problems.push(problem);
    }
    return problems;
  }

}
