import { Router } from '@angular/router';
import { AccountService } from './../../../services/account.service';
import { CreateUser } from './../../models/createUser';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(
    public accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }
  form!: FormGroup;
  message = '';
  hide1 = true;
  hide2 = true;
  dialogVisibility = false;
  submittedUsername = '';
  user = new CreateUser();
  interval: any;
  success = 0;
  emailExists: any;
  usernameExists: any;
  darkTheme!: boolean;


  submit() {
    this.user.firstName = this.f.firstName.value;
    this.user.lastName = this.f.lastName.value;
    this.user.email = this.f.email.value;
    this.user.sex = this.f.sex.value;
    this.user.password = this.f.password.value;
    this.user.username = this.f.username.value;
    this.user.telephone = this.f.telephone.value;
    this.user.addressEntity.address = this.f.address.value;
    this.user.addressEntity.postalCode = this.f.postalCode.value;
    this.user.addressEntity.city = this.f.city.value;
    this.user.addressEntity.county = this.f.county.value;
    this.submittedUsername = this.user.username;
    this.accountService.createUser(this.user).subscribe(
      () => {
        this.success = 1;
        this.interval = setInterval(() => {
          this.router.navigate(['/account/login']);
        }, 5000);
      },
      (err) => {
        this.success = 2;
        this.message = err.error;
        this.dialogVisibility = true;
        this.interval = setInterval(() => {
          this.dialogVisibility = false;
        }, 5000);
      }
    );
  }
  get f() {
    return this.form.controls;
  }

  checkUsername() {
    this.accountService
      .checkUsernameNotTaken(this.f.username.value)
      .subscribe((response: any) => {
        this.usernameExists = response;
      });
  }

  checkEmail() {
    if (this.f.email.valid)
      this.accountService
        .checkEmailNotTaken(this.f.email.value)
        .subscribe((response: any) => {
          this.emailExists = response;
        });
  }

  ngOnInit(): void {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    this.form = this.formBuilder.group({
      sex: '',
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
          ),
        ],
      ],
      passwordRetype: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('[0-9]{7,12}')]],
      address: ['', Validators.required],
      county: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: '',
    });
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
