import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthDataResponse {
  email: string;
  _token: string;
  isAdmin: boolean;
  id: string;
  errorMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  urlStr: string;
  constructor(private http: HttpClient, private router: Router) {
    this.urlStr = environment.baseURL + 'auth/';
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthDataResponse>(this.urlStr + 'register', {
        email: email,
        password: password,
      })
      .pipe(
        timeout(10000),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.id,
            resData._token,
            resData.isAdmin
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      isAdmin: boolean;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      userData.isAdmin
    );
    this.user.next(loadedUser);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthDataResponse>(this.urlStr + 'login', {
        email: email,
        password: password,
      })
      .pipe(
        timeout(10000),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.id,
            resData._token,
            resData.isAdmin
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    isAdmin: boolean
  ) {
    const user = new User(email, id, token, isAdmin);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
