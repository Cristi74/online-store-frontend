import { User } from 'src/app/models/user';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateUser } from 'src/app/models/createUser';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject!: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private http: HttpClient) {
    if (localStorage.hasOwnProperty('user'))
      this.userSubject = new BehaviorSubject<User>(
        JSON.parse(localStorage.getItem('user') || '{}')
      );
    else this.userSubject = new BehaviorSubject<any>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(username: any, password: any) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/login`,
        { username: username, password: password },
        { observe: 'response' as 'body' }
      )
      .pipe(
        map((user) => {
          let userM = user.body;
          userM.token = user.headers.get('Authorization');
          localStorage.setItem('user', JSON.stringify(userM));
          this.userSubject.next(user.body);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next({
      id: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      token: '',
    });
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users/findAll`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: any, params: any) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params).pipe(
      map((x) => {
        if (id == this.userValue.id) {
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }
        return x;
      })
    );
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }
  createUser(user: any) {
    return this.http.post(`${environment.apiUrl}/users`, user);
  }

  // publish updated user to subscribers
  userUpdate(id: any, updatedUser: any) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, updatedUser);
  }

  confirmAccount(id: any) {
    return this.http.put(
      `${environment.apiUrl}/userConfirmation?userId=${id}`,
      id
    );
  }

  checkEmailNotTaken(email: string) {
    return this.http.get<boolean>(`${environment.apiUrl}/users/existsByEmail?email=${email}`);
  }

  checkUsernameNotTaken(username: any): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/users/existsByUsername?username=${username}`);
  }

  sendEmailForResetPassword(email: string){
    return this.http.post(`${environment.apiUrl}/users/forgot-password?email=${email}`, email);
  }
 
  resetPassword(newPassword: string, token: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/users/reset-password?token=${token}&password=${newPassword}`,
      newPassword
    );
  }

  loginSocialFB(user: any) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/login/facebook`,
        user,
        { observe: 'response' as 'body' }
      )
      .pipe(
        map((user) => {
          let userM = user.body;
          userM.token = user.headers.get('Authorization');
          localStorage.setItem('user', JSON.stringify(userM));
          this.userSubject.next(user.body);
          return user;
        })
      );
  }
  
  loginSocialGoogle(user: any) {
    return this.http
      .post<any>(
        `${environment.apiUrl}/login/google`,
        user,
        { observe: 'response' as 'body' }
      )
      .pipe(
        map((user) => {
          let userM = user.body;
          userM.token = user.headers.get('Authorization');
          localStorage.setItem('user', JSON.stringify(userM));
          this.userSubject.next(user.body);
          return user;
        })
      );
  }

}
