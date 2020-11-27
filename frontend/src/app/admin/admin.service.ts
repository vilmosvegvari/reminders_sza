import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface UserResponse {
  email: string;
  userId: string;
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  users = new BehaviorSubject<UserResponse[]>(null);

  constructor(private http: HttpClient) {}

  fetchUsers() {
    this.http
      .get<UserResponse[]>(environment.baseURL + 'users')
      .pipe(
        map((users) => {
          return users.map((user) => {
            return {
              email: user.email,
              userId: user.userId,
              isAdmin: user.isAdmin,
            };
          });
        }),
        tap((users) => {
          this.users.next(users);
        })
      )
      .subscribe();
  }

  deleteUser(userid) {
    this.http
      .delete<Number>(environment.baseURL + `users/${userid}`)
      .subscribe(() => {
        this.fetchUsers();
      });
  }
}
