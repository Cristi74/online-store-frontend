import { Component, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../../services/account.service';

@Component({
  templateUrl: 'layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  userLanguage = '';
  constructor(
    private router: Router,
    private accountService: AccountService,
    private elementRef: ElementRef,
    public translate: TranslateService
  ) {
    translate.addLangs(['ro', 'en', 'de']);
    if (!localStorage.hasOwnProperty('lang'))
      localStorage.setItem('lang', JSON.stringify('en'));
    this.userLanguage = JSON.parse(localStorage.getItem('lang') || 'null');
    let browserLang: string;
    if (this.userLanguage != '') browserLang = this.userLanguage;
    else browserLang = translate.getBrowserLang();
    translate.setDefaultLang(browserLang);
    translate.use(browserLang.match(/ro|en|de/) ? browserLang : 'ro');
  }
  darkTheme!: boolean;
  setLanguage(lang: string) {
    localStorage.setItem('lang', JSON.stringify(lang));
  }
  ngOnInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }
  ngAfterViewInit() {
    this.darkTheme ?
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#3d3c3c"
      : this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fafbfc';
  }
}
