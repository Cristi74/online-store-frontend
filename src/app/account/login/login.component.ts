import { CreateUser } from './../../models/createUser';
import { CartService } from './../../../services/cart.service';
import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, first } from 'rxjs/operators';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

import { AccountService } from '../../../services/account.service';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

const googleLogoURL =
  "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  emailForm!: FormGroup;
  exist = true;
  inexistentEmail!: string;
  sent = false;
  loading = false;
  submitted = false;
  returnUrl!: string;
  hide = true;
  serverMessage = '';
  errorFromServer = false;
  popup = false;
  email = false;
  darkTheme!: boolean;
  user!: SocialUser;
  loggedIn!: boolean;
  userApp: CreateUser = new CreateUser();
  valueUser!: string;
  valuePass!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public accountService: AccountService,
    private elementRef: ElementRef,
    private cartService: CartService,
    private authService: SocialAuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL));
  }

  ngOnInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
          ),
        ],
      ],
    });
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.userApp.firstName = user.firstName;
        this.userApp.lastName = user.lastName;
        this.userApp.email = user.email;
        this.userApp.token = user.authToken;
        this.userApp.username = user.id
        this.loggedIn = (user != null);
      }
    });
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    this.errorFromServer = false;
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.accountService
      .login(this.formControls.username.value, this.formControls.password.value)
      .pipe(first())
      .subscribe(
        (response: Response) => {
          this.addCart();
          this.backToPreviousPage();
        },
        (error) => {
          this.serverMessage = error.error;
          if (error.status === 401) {
            this.errorFromServer = true;
            if (
              this.serverMessage &&
              this.serverMessage.search('Username') != 0
            ) {
              this.popup = true;
              this.serverMessage = error.error;
              this.hidePopup();
            }
          }
          if (error.status === 500) {
            this.serverMessage = 'You are not registered.';
            this.errorFromServer = true;
          }
          this.submitted = false;
          this.loading = false;
        }
      );
  }

  addCart() {
    this.cartService
      .getCart()
      .pipe(catchError((err) => of([])))
      .subscribe(
        (res) => {
          this.cartService.mergeCarts(res);
        },
        (err) => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      );
  }

  hidePopup() {
    setTimeout(() => {
      this.popup = false;
    }, 5000);
  }

  sendEmail() {
    this.accountService
      .sendEmailForResetPassword(this.emailForm.controls.email.value)
      .subscribe(
        (res) => {
          this.sent = true;
          this.sent = true;
          this.email = false;
          this.exist = true;
        },
        (err) => {
          if (err.status = 404) this.exist = false;
          this.inexistentEmail = this.emailForm.controls.email.value;
          console.log(err);
        }
      );
  }

  removeDoesntExist() {
    if (this.emailForm.controls.email.value !== this.inexistentEmail)
      this.exist = true;
    else this.exist = false;
  }

  ngAfterViewInit() {
    this.darkTheme ?
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#3d3c3c"
      : this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fafbfc';
  }
  backToPreviousPage() {
    const { redirect } = window.history.state;
    if (redirect == '/cart') this.router.navigateByUrl('/order');
    else this.router.navigateByUrl(redirect || '/');
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((res) => {
        console.log(res.email);
        this.accountService.loginSocialGoogle(this.userApp).subscribe(
          (res) => {
            if (res.email != null || res.email != "") {
              this.addCart();
              this.backToPreviousPage();
            }
          }
        )
        this.refreshToken();
      }).catch((err) => console.error(err))
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((res) => {
        console.log(res);
        this.accountService.loginSocialFB(this.userApp).subscribe(
          (res) => {
            this.addCart();
            res ? this.backToPreviousPage() : null;
          }
        )
      }).catch((err) => console.error(err))
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID)
  }
}
