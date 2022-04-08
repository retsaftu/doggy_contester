import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';

class FileSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: any
  constructor(
    private router: Router,
    private userService: UserService,
    private fileService: FileService
  ) { }

  fileType = '';

  selectedFile: FileSnippet | any;

  filePath = '';

  ngOnInit(): void {
    this.fileType = '.jpeg,.png,';
    let splittedUrl = this.router.url.split('/');
    console.log(`splittedUrl`, splittedUrl);
    const id = splittedUrl[splittedUrl.length - 1];
    console.log(`id`, id);
    this.userService.getUserById(id).subscribe((res: any) => {
      console.log(`res`, res);
      this.user = res
      this.filePath = this.user.avatar;
    });
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

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new FileSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      console.log(this.selectedFile);
      this.fileService.uploadAvatar(this.selectedFile.file).subscribe(
        (res: any) => {
          this.onSuccess();
          setTimeout(() => {
            this.selectedFile = null;
          }, 5000);
          console.log(`res`, res);
          this.filePath = res[0].avatar;
          // res.data ? this.uploadResult.emit(res.data) : null;
        },
        (err: any) => {
          this.onError();
          setTimeout(() => {
            this.selectedFile = null;
          }, 5000);
        })
    });

    reader.readAsDataURL(file);
  }


}
