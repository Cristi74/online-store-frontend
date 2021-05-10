import { User } from 'src/app/models/user';
import { AccountService } from './../../services/account.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private elementRef: ElementRef,
    private accountService: AccountService,
  ) {
  }
  user!: User;
  newUser = JSON.parse('{ }');
  userLogo: any;
  accountName = true;
  accountPassword = true;
  accountAddress = true;
  regExpStr = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}';
  detailsOption = 1;
  newPassword = '';
  repeatPassword = '';
  hide = true;
  eyeIcon = false;
  validPassword = true;
  passwordMatch = true;
  confirm = false;
  interval: any;
  order: any;
  darkTheme!: boolean;
  curentTheme!: boolean;

  enableNameForm() {
    this.accountName = !this.accountName;
  }
  enablePasswordForm() {
    this.accountPassword = !this.accountPassword;
    this.eyeIcon = !this.eyeIcon;
  }
  enableAddressForm() {
    this.accountAddress = !this.accountAddress;
  }
  submitName() {
    if (this.user.password == '') {
      this.user.password = this.newUser.password;
    }
    this.accountService.userUpdate(this.user.id, this.user).subscribe();
    localStorage.setItem('user', JSON.stringify(this.user));
    this.confirm = true;
    this.interval = setInterval(() => {
      this.confirm = false;
    }, 1500);
  }
  submitPassword() {
    if (this.newPassword == this.repeatPassword && this.newPassword != '') {
      if (new RegExp(this.regExpStr, 'g').test(this.newPassword)) {
        this.user.password = this.newPassword;
        this.accountService.userUpdate(this.user.id, this.user).subscribe();
        this.confirm = true;
        this.interval = setInterval(() => {
          this.validPassword = true;
          this.confirm = false;
        }, 3500);
      }
      this.validPassword = false
    } else {
      this.passwordMatch = false;
    }
  }
  submitAddress() {
    if (this.user.password == '') {
      this.user.password = this.newUser.password;
    }
    this.accountService.userUpdate(this.user.id, this.user).subscribe();
    localStorage.setItem('user', JSON.stringify(this.user));
    this.confirm = true;
    this.interval = setInterval(() => {
      this.confirm = false;
    }, 1500);
  }

  receiveSectionChangeFromMyOrder($event: any) {
    this.detailsOption = 4;
    this.order = $event;
  }
  receiveSectionChangeFromOrderItem($event: any) {
    this.detailsOption = $event;
  }

  ngOnInit() {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    this.newUser = JSON.parse(localStorage.getItem('user') || '{ }');
    if (this.newUser.hasOwnProperty('firstName'))
      this.userLogo =
        this.newUser.firstName[0].toUpperCase() +
        this.newUser.lastName[0].toUpperCase();
    this.user = { ...this.newUser, password: '' };
  }
  ngAfterViewInit() {
    this.darkTheme ?
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#3d3c3c"
      : this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#fafbfc';
  }
  receive(event: any) {
    this.curentTheme = event
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.curentTheme
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
  }

  ngOnDestroy() {
    if ((this, this.interval)) {
      clearInterval(this.interval);
    }
  }
}
