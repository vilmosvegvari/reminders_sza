import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

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
      .get<Reminder[]>('http:/localhost:3000/reminders', {})
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
    notification: string,
    userid: string
  ) {
    this.http
      .post<Reminder>('http:/localhost:3000/reminders', {
        name: name,
        deadline: deadline,
        description: description,
        notification: notification,
        creator: userid,
        creation: creation,
      })
      .pipe(take(1))
      .subscribe((response) => {
        this.getReminders();
      });
  }

  updateReminder(
    reminderid: number,
    name: string,
    deadline: Date,
    creation: Date,
    description: string,
    notification: string,
    userid: string
  ) {
    this.http
      .put<Reminder>(`http:/localhost:3000/reminders/${reminderid}`, {
        name: name,
        deadline: deadline,
        description: description,
        notification: notification,
        creator: userid,
        creation: creation,
      })
      .pipe(take(1))
      .subscribe((response) => {
        this.getReminders();
      });
  }

  deleteReminder(reminderid) {
    this.http
      .delete<Reminder>(`http:/localhost:3000/reminders/${reminderid}`)
      .pipe(take(1))
      .subscribe((response) => {
        this.getReminders();
      });
  }
}
