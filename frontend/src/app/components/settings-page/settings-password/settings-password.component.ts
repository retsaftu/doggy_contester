import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-password',
  templateUrl: './settings-password.component.html',
  styleUrls: ['./settings-password.component.css']
})
export class SettingsPasswordComponent implements OnInit {

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService
  ) { }

  hideOldPassword = true;
  hideNewPassword = true;

  form = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
  }

  get isAllFieldsAreValid() {
    return !this.oldPassword?.hasError('required') && !this.newPasswrod?.hasError('required');
  }

  changePassword() {
    if(!this.isAllFieldsAreValid) {
      return;
    }
    this.userService.changePassword(this.oldPassword?.value, this.newPasswrod?.value).subscribe((res) => {
      this.snackBarService.openSuccessSnackBar('Password changed successfully')
      this.form.get('oldPassword')?.reset('');
      this.form.get('newPassword')?.reset('');
    })
  }

  get oldPassword() { return this.form.get('oldPassword') }

  get newPasswrod() { return this.form.get('newPassword') }

}
