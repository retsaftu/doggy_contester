import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private isDark = false;

  private readonly lightThemeClass = 'theme-light';
  private readonly darkThemeClass = 'theme-dark';
  private readonly DEFAULT_CLASSES = 'mat-typography mat-app-background' // Без этого ничего не работает

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) { }

  ngOnInit(): void {
    const currentTheme = localStorage.getItem(environment.themeField);
    this.renderer.setAttribute(this.document.body, 'class',  this.DEFAULT_CLASSES + ' ' + currentTheme)
  }

  changeTheme() {
    this.isDark = !this.isDark;
    const hostClass = this.isDark ? this.darkThemeClass : this.lightThemeClass;
    localStorage.setItem(environment.themeField, hostClass);
    this.renderer.setAttribute(this.document.body, 'class', this.DEFAULT_CLASSES + ' ' + hostClass);
  }

}
