import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContestInfo, ProblemContent } from 'src/app/entities/contester.entity';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { FileService } from '../../services/file.service';

class FileSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-contest-problem',
  templateUrl: './contest-problem.component.html',
  styleUrls: ['./contest-problem.component.css']
})



export class ContestProblemComponent implements OnInit {

  contestId!: string;

  constructor(
    private router: Router,
    private fileService: FileService,
    private authService: AuthService,
    private userService: UserService,
    private snackBarService: SnackBarService
  ) { }

  @Input() problems: any[] = [];

  @Input() currentProblem!: any;

  @Input() contestInfo!: any;

  fileType!: string;

  disabled = false;

  userId: any;
  selectedFile: FileSnippet | any;

  isLoading = false;

  private _isParticipant = false;

  ngOnInit(): void {
    this.fileType = '.cpp,.js,.py';
    let splittedUrl = this.router.url.split('/');
    this.contestId = splittedUrl[splittedUrl.length - 1];
    for(let i=0; i<this.contestInfo?.participants?.length; i++) {
      if(this.userService.userInfo._id.toString() == this.contestInfo?.participants[i]?._id.toString()) {
        this._isParticipant = true;
        break;
      }
    }
  }

  ngOnChanges() {
    console.log('problem contests', this.currentProblem);
  }

  generationList() {
    const problems: ProblemContent[] = [];
    const descriptionTmp = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis tempore velit maxime nemo animi laboriosam illum ullam. Eos fuga ullam blanditiis at dignissimos, beatae architecto ipsa nesciunt necessitatibus numquam nemo!'
    for (let i = 0; i < 7; i++) {
      let description = ""
      for (let j = 0; j < 10; j++) {
        description += descriptionTmp;
      }
      const problem = new ProblemContent("Problem " + i, description, "2\n3 2", "5\n10", 1000, 1);
      problems.push(problem);
    }
    return problems;
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(fileInput: any) {
    const file: File = fileInput.files[0];
    const reader = new FileReader();

    this.isLoading = true;    

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new FileSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      console.log(this.selectedFile);
      this.fileService.uploadOne(this.selectedFile.file, this.contestId, this.currentProblem._id).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.onSuccess();
          setTimeout(() => {
            this.selectedFile = null;
          }, 5000);
          if(res.correctTestCases == res.totalTestCases) {
            this.snackBarService.openSuccessSnackBar("Correct: " + res.correctTestCases + "/" + res.totalTestCases, 5000)
          } else {
            this.snackBarService.openErrorSnackBar("Correct: " + res.correctTestCases + "/" + res.totalTestCases, 5000)
          }
          // res.data ? this.uploadResult.emit(res.data) : null;
        },
        (err: any) => {
          this.onError();
          this.isLoading = false;
          setTimeout(() => {
            this.selectedFile = null;
          }, 5000);
      })
    });

    reader.readAsDataURL(file);
  }

  get isLoggedIn() { return this.authService.isLoggedIn() }

  get isOwner() { return this.userService.userInfo._id == this.contestInfo.owner._id}

  get isParticipant() { return this._isParticipant }

  set isParticipant(isParticipant: boolean) { this._isParticipant = isParticipant }

}
