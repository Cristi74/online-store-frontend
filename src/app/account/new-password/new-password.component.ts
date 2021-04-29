import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  newPassword!: string;
  repeatPassword!: string;
  interval!: any;
  confirm = false;
  validPassword: boolean = false;
  passwordMatch: boolean = true;
  token = this.route.snapshot.queryParams.token;
  resp: any;
  darkTheme!: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.darkTheme = JSON.parse(localStorage.getItem('darkTheme')!)
    this.form = this.formBuilder.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}'
          ),
        ],
      ],
      repeatPassword: ['', Validators.required],
    });
  }
  get formControls() {
    return this.form.controls;
  }
  submitNewPassword() {
    this.newPassword = this.formControls.newPassword.value;
    this.repeatPassword = this.formControls.repeatPassword.value;
    if (
      this.formControls.newPassword.value ==
      this.formControls.repeatPassword.value &&
      this.formControls.newPassword.value != ''
    ) {
      this.accountService.resetPassword(this.newPassword, this.token).subscribe(
        (response: Response) => {
          console.log('response:', response);
        },
        (error) => {
          console.error(error.status);
          if (error.status === 200) {
            this.confirm = true;
            this.interval = setInterval(() => {
              this.router.navigate(['/account/login']);
              this.validPassword = true;
              this.confirm = false;
            }, 3500);
            this.validPassword = false;
          }
        }
      );
    } else {
      this.passwordMatch = false;
    }
    this.interval = setInterval(() => {
      this.passwordMatch = true;
    }, 5000);
  }
  ngOnDestroy() {
    if ((this.interval)) {
      clearInterval(this.interval);
    }
  }
}
