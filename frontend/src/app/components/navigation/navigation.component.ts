import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private isDark = false;

  isAuthenticated = false;

  currentRoute = '';

  private readonly lightThemeClass = 'theme-light';
  private readonly darkThemeClass = 'theme-dark';
  private readonly DEFAULT_CLASSES = 'mat-typography mat-app-background' // Без этого ничего не работает

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2,
              private authService: AuthService, private router: Router) { 
      this.router.events.subscribe((val) => {
        if(val instanceof NavigationStart) {
          let splitedRoute = val.url.split('/');
          if(splitedRoute.length > 1) {
            this.currentRoute = splitedRoute[1];
          }
        }
      })
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();

    let splitedRoute = this.router.url.split('/');
    if(splitedRoute.length > 1) {
      this.currentRoute = splitedRoute[1];
    }

    const currentTheme = localStorage.getItem(environment.themeField);
    this.isDark = currentTheme == this.darkThemeClass;
    this.renderer.setAttribute(this.document.body, 'class',  this.DEFAULT_CLASSES + ' ' + currentTheme);
  }

  changeTheme() {
    this.isDark = !this.isDark;
    const hostClass = this.isDark ? this.darkThemeClass : this.lightThemeClass;
    localStorage.setItem(environment.themeField, hostClass);
    this.renderer.setAttribute(this.document.body, 'class', this.DEFAULT_CLASSES + ' ' + hostClass);
  }

  signUp(){
    this.router.navigate(['/auth'], {queryParams: {signUp: "show"}})
  }

  login(){
    this.router.navigate(['/auth'])
  }

}
