import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { SearchService } from './../../services/search.service';
import { CartService } from './../../services/cart.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SocialAuthService } from 'angularx-social-login';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  cart: any;
  searchTerm = '';
  qty = 0;
  qtyEmitter$ = new BehaviorSubject<number>(this.qty);
  userLogged!: boolean;
  user!: User;
  userLanguage = '';
  userOptions = false;
  darkTheme = false;
  constructor(
    private cartService: CartService,
    private searchService: SearchService,
    private router: Router,
    private authService: SocialAuthService,
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
    translate.use(browserLang.match(/ro|en|de/) ? browserLang : 'en');
  }
  @Output() curentTheme: EventEmitter<string> = new EventEmitter();
  changeSearchTerm(event: any) {
    this.searchTerm = event.target.value;
    this.searchService.changeTerm(this.searchTerm);
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', JSON.stringify(lang));
  }

  signout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    this.cartService.update({});
    this.signOut();
    this.userOptions = false;
    localStorage.hasOwnProperty('user')
      ? (this.userLogged = true)
      : (this.userLogged = false);
    this.router.navigate(['/']);
  }
  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit() {
    localStorage.hasOwnProperty('user')
      ? (this.userLogged = true)
      : (this.userLogged = false);
    this.user = JSON.parse(localStorage.getItem('user') || '[]');
    this.cartService.currentCart.subscribe((cart) => {
      this.cart = cart;
      this.qty = 0;
      for (let key in this.cart.products) this.qty += this.cart.products[key];
      this.qtyEmitter$.next(this.qty);
    });
    !localStorage.hasOwnProperty('darkTheme') ? localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme)) :
      this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }

  goToLogin() {
    this.router.navigate(['/account/login'], {
      state: { redirect: this.router.url },
    });
  }

  changeTheme() {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('darkTheme', JSON.stringify(this.darkTheme));
    this.changeThemes();
  }
  changeThemes() {
    let bckColor = this.darkTheme ? "#3d3c3c" : "#fafbfc";
    this.curentTheme.emit(bckColor);
  }
}
