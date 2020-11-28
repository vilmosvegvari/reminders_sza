import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { ReminderService } from '../reminder/reminder.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private reminderService: ReminderService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.isAdmin = user.isAdmin;
      } else {
        this.isAdmin = false;
      }
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onReminderPage() {
    return this.router.url === '/reminders';
  }

  reminderSearch(input) {
    this.reminderService.search(input);
  }

  onLogout() {
    if (!this.isAuthenticated) {
      return;
    }
    this.authService.logout();
  }
}
