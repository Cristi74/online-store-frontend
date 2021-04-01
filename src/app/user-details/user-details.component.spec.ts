import { AccountService } from './../../services/account.service';
import { FormsModule } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      declarations: [UserDetailsComponent],
      providers: [{ provide: AccountService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable name editing', () => {
    spyOn(component, 'enableNameForm').and.callThrough
    component.enableNameForm();
    expect(component.accountName).toBe(true);
  });

  it('should enable password editing', () => {
    spyOn(component, 'enablePasswordForm').and.callThrough
    component.enablePasswordForm();
    expect(component.accountPassword).toBe(true);
  });

  it('should enable address editing', () => {
    component.enableAddressForm();
    expect(component.accountAddress).toBe(false);
  });

  it('should submit new name through account service', () => {
    const accountService = fixture.debugElement.injector.get(AccountService);
    const mySpy = spyOn(accountService, 'userUpdate').and.callThrough();
    component.submitName();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });

  it('should submit new password through account service', () => {
    const accountService = fixture.debugElement.injector.get(AccountService);
    const mySpy = spyOn(accountService, 'userUpdate').and.callThrough();
    component.newPassword = component.repeatPassword = 'Test1234?';
    component.submitPassword();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });

  it('should submit new address through account service', () => {
    const accountService = fixture.debugElement.injector.get(AccountService);
    const mySpy = spyOn(accountService, 'userUpdate').and.callThrough();
    component.submitAddress();
    expect(mySpy).toHaveBeenCalledTimes(1);
  });
});
