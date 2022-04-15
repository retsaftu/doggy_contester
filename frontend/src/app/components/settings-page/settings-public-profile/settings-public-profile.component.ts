import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserBasicInfo, UserProfileInfo } from 'src/app/entities/user.entity';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { AvatarDialogComponent } from '../../user/avatar-dialog/avatar-dialog.component';

@Component({
  selector: 'app-settings-public-profile',
  templateUrl: './settings-public-profile.component.html',
  styleUrls: ['./settings-public-profile.component.css']
})
export class SettingsPublicProfileComponent implements OnInit {

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService
  ) { }

  user!: any;

  private _id!: string;

  filePath = ''

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    about: new FormControl('')
  })

  ngOnInit(): void {
    this._id = this.userService.userInfo._id;
    this.userService.getUserById(this._id).subscribe((res: any) => {
      this.user = res;
      console.log(this.user)
      this.filePath = this.user.avatar;
      this.form.get('name')?.setValue(this.user.name);
      this.form.get('username')?.setValue(this.user.username);
      this.form.get('about')?.setValue(this.user.about);
    })
  }

  openDialog() {
    if(this.userService.userInfo._id != this.user._id) {
      return;
    }
    const dialogRef = this.dialog.open(AvatarDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result?.avatarUpdated) {
        this.userService.getUserById(this.user._id).subscribe((res: any) => {
          this.user = res
          this.filePath = this.user.avatar;
          this.userService.userInfo = new UserBasicInfo(res.username, res._id, res.balance, res.avatar);
          this.userService.emitChangeOfUserProfile(this.userService.userInfo);
        });
      }
    });
  }

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
