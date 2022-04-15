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

  ngOnInit(): void {
    this.user = this.userService.userInfo;
    this.userService.changeEmitted$.subscribe((info) => {
      this.user = info;
    })
  }

}
