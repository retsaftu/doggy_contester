import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public user: any
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    let splittedUrl = this.router.url.split('/');
    console.log(`splittedUrl`, splittedUrl);
    const id = splittedUrl[splittedUrl.length - 1];
    console.log(`id`, id);
    this.userService.getUserById(id).subscribe((res: any) => {
      console.log(`res`, res);
      this.user = res
    });
  }

}
