import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from 'src/app/entities/user.entity';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-main-page',
  templateUrl: './settings-main-page.component.html',
  styleUrls: ['./settings-main-page.component.css']
})
export class SettingsMainPageComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  user!: any;

  private _id!: string;

  ngOnInit(): void {
    this._id = this.userService.userInfo._id;
    this.userService.getUserById(this._id).subscribe((res: any) => {
      this.user = res;
    })
  }

}
