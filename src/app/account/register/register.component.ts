import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { CreateUser } from './../../models/createUser';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(private accountService: AccountService, private router: Router) {}
  option = 1;
  user = new CreateUser('', '', '', '', '', '', '', {
    address: '',
    city: '',
    county: '',
    postalCode: '',
  });
  interval: any;
  success = 0;

  optionIncrease() {
    this.option++;
  }
  optionDecrease() {
    this.option--;
  }
  submit() {
    this.accountService.createUser(this.user).subscribe(
      () => {
        this.success = 1;
        this.interval = setInterval(() => {
          this.router.navigate(['/account/login']);
        }, 2000);
      },
      (err) => {
        this.success = 2;
        console.log(err);
      }
    );
    console.log(this.user);
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
