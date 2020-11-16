import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthDataResponse, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObserver: Observable<AuthDataResponse>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObserver = this.authService.login(email, password);
    } else {
      authObserver = this.authService.signup(email, password);
    }

    authObserver.subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/reminders']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        if (errorMessage.name === 'TimeoutError') {
          this.error = errorMessage.message;
        } else {
          this.error = errorMessage.status + ' - ' + errorMessage.statusText;
        }
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
