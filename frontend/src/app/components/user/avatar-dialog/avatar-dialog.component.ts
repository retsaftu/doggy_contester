import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { UserService } from 'src/app/services/user.service';
import { UserComponent } from '../user.component';

class FileSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.css']
})
export class AvatarDialogComponent implements OnInit {

  constructor(
    private fileService: FileService,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserComponent>,
  ) { }

  fileType = '.jpeg,.png,';

  currentAvatar = '';

  filePath!: string;

  selectedFile: FileSnippet | any;

  ngOnInit(): void {
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
      this.currentAvatar = this.selectedFile.src;
      this.fileService.uploadAvatar(this.selectedFile.file).subscribe(
        (res: any) => {
          this.onSuccess();
          setTimeout(() => {
            this.selectedFile = null;
          }, 5000);
          this.dialogRef.close( { avatarUpdated: true} )
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

  setDefaultAvatar() {
    this.userService.deleteAvatar().subscribe((res) => {
      this.dialogRef.close( { avatarUpdated: true} )
    })
  }

  cancel() {
    this.dialogRef.close();
  }
  
}