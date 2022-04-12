import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  private token!: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(res=>{
      this.token = res['token'];
      this.authService.confirmEmail(this.token).subscribe((res) => {
        this.router.navigate(['']);
      })
    })
  }

}
