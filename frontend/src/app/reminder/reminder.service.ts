import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Reminder } from './reminder.model';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  // this is for searching
  allReminders: Reminder[] = [
    {
      id: '1',
      name: 'Buy food',
      deadline: new Date(),
      creation: new Date(),
      notification: 'email',
      description: ' I need to buy food to not die.',
    },
  ];
  //this is what we showing
  reminders: BehaviorSubject<Reminder[]> = new BehaviorSubject(
    this.allReminders
  );

  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseURL;
  }

  search(text: string) {
    if (text) {
      let newReminders = this.allReminders.filter((reminder) =>
        reminder.name.toUpperCase().includes(text.toUpperCase())
      );

      this.reminders.next(newReminders);
      return;
    }
    this.reminders.next(this.allReminders);
  }

  getReminders() {
    this.http
      .get<Reminder[]>(this.baseURL + 'reminders', {})
      .pipe(take(1))
      .subscribe((response) => {
        this.allReminders = response;
        this.reminders.next(this.allReminders);
      });
  }

  createReminder(
    name: string,
    deadline: Date,
    creation: Date,
    description: string,
    notification: string
  ) {
    this.http
      .post<Reminder>(this.baseURL + 'reminders', {
        name: name,
        deadline: deadline,
        description: description,
        notification: notification,
        creation: creation,
      })
      .pipe(take(1))
      .subscribe((response) => {
        this.getReminders();
      });
  }

  updateReminder(reminder: Reminder) {
    this.http
      .put<Reminder>(this.baseURL + `reminders/${reminder.id}`, {
        name: reminder.name,
        deadline: reminder.deadline,
        description: reminder.description,
        notification: reminder.notification,
        creation: reminder.creation,
      })
      .pipe(take(1))
      .subscribe((response) => {
        this.getReminders();
      });
  }

  deleteReminder(reminderid) {
    this.http
      .delete<Reminder>(this.baseURL + `reminders/${reminderid}`)
      .pipe(take(1))
      .subscribe((response) => {
        this.getReminders();
      });
  }
}
