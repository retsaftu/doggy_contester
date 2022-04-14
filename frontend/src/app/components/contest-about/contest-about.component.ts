import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contest-about',
  templateUrl: './contest-about.component.html',
  styleUrls: ['./contest-about.component.css']
})
export class ContestAboutComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @Input() contestInfo !: any

  ngOnInit(): void {
  }

  ngOnChange() {
  }

  openOnwerProfile() {
    const onwerProfileLink = '/user/' + this.contestInfo?.owner?._id;
    console.log(onwerProfileLink);
    this.router.navigate([onwerProfileLink]);
  }

}
