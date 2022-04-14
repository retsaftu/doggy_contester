import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserBasicInfo, UserProfileInfo } from 'src/app/entities/user.entity';
import { FileService } from 'src/app/services/file.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: any;

  editMode = false;

  filePath = '';

  id = '';

  tmp = 0;

  form!: FormGroup;

  _isOwner = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fileService: FileService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBarService: SnackBarService
  ) {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      about: new FormControl('')
    })
  }

  // selectedFile: FileSnippet | any;

  ngOnInit(): void {
    let splittedUrl = this.router.url.split('/');
    console.log(`splittedUrl`, splittedUrl);
    this.id = splittedUrl[splittedUrl.length - 1];
    console.log(`id`, this.id);
    this.userService.getUserById(this.id).subscribe((res: any) => {
      console.log(`res`, res);
      this.user = res;
      this.filePath = this.user.avatar;
      this._isOwner = this.userService.userInfo._id == this.id;
      if(this._isOwner) {
        this.form.get('name')?.setValue(this.user.name);
        this.form.get('username')?.setValue(this.user.username);
        this.form.get('about')?.setValue((!!this.user.about ? this.user.about : ''));
      }
    });
  }

  // ngOnChange() {
  //   let splittedUrl = this.router.url.split('/');
  //   console.log(`splittedUrl`, splittedUrl);
  //   this.id = splittedUrl[splittedUrl.length - 1];
  //   console.log(`id`, this.id);
  //   this.userService.getUserById(this.id).subscribe((res: any) => {
  //     console.log(`res`, res);
  //     this.user = res;
  //     this.filePath = this.user.avatar;
  //     this._isOwner = this.userService.userInfo._id == this.id;
  //     if(this._isOwner) {
  //       this.form.get('name')?.setValue(this.user.name);
  //       this.form.get('username')?.setValue(this.user.name);
  //       this.form.get('about')?.setValue((!!this.user.about ? this.user.about : ''));
  //     }
  //   });
  // }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result?.avatarUpdated) {
        this.userService.getUserById(this.id).subscribe((res: any) => {
          this.user = res
          this.filePath = this.user.avatar;
          this.userService.userInfo = new UserBasicInfo(res.username, res._id, res.balance, res.avatar);
          this.userService.emitChangeOfUserProfile(this.userService.userInfo);
        });
      }
    });
  }

  startEdit() {
    this.editMode = true;
  }

  cancelEditting() {
    this.editMode = false;
  }

  get isOwner() {return this._isOwner;}

  get isSomethingChanged() {
    return (this.user.name != this.formName || this.user.username != this.formUsername ||
       ((!!this.user.about ? this.user.about : '') != this.formAbout))
  }

  saveChanges() {
    if(this.isSomethingChanged) {
      const name = this.form.get('name')?.value;
      const username = this.form.get('username')?.value;
      const about = this.form.get('about')?.value;
      const userProfileInfo = new UserProfileInfo(name, username, about);
      console.log(userProfileInfo);
      this.userService.updateUserProfile(userProfileInfo).subscribe(
      {
        next: (res: any) => {
          this.snackBarService.openSuccessSnackBar("Updated successfully", 5000);
          this.editMode = false;

          if(this.formName != this.user.name) {
            this.user.name = this.formName;
          }

          if(this.formUsername != this.user.username) {
            this.user.username = this.formUsername;
            this.userService.username = this.user.username;
            this.userService.emitChangeOfUserProfile(this.userService.userInfo);
          }

          if(this.formAbout != this.user.about) {
            this.user.about = this.formAbout;
          }
        }
      })
    }
  }

  get formUsername() { return this.form.get('username')?.value?.trim() }

  get formName() { return this.form.get('name')?.value?.trim(); }

  get formAbout() { return this.form.get('about')?.value?.trim(); }

}
