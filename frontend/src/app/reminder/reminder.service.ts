import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Reminder } from './reminder.model';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  // this is for searching
  allReminders: Reminder[] = [];
  // this is what we showing
  reminders: BehaviorSubject<Reminder[]> = new BehaviorSubject(
    this.allReminders
  );

  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseURL;
  }

  search(text: string) {
    if (text) {
      let newReminders = this.allReminders.filter(
        (reminder) =>
          reminder.name.toUpperCase().includes(text.toUpperCase()) ||
          reminder.notification.toUpperCase().includes(text.toUpperCase()) ||
          reminder.deadlineString.toUpperCase().includes(text.toUpperCase())
      );

      this.reminders.next(newReminders);
      return;
    }
    this.reminders.next(this.allReminders);
  }

  getReminders() {
    this.http
      .get<Reminder[]>(this.baseURL + 'reminders', {})
      .pipe(
        map((reminders) => {
          return reminders.map((reminder) => {
            return {
              ...reminder,
              deadlineString: new Date(reminder.deadline)
                .toLocaleString()
                .slice(0, -3),
              creationString: new Date(reminder.creation)
                .toLocaleString()
                .slice(0, -3),
            };
          });
        }),
        take(1)
      )
      .subscribe((response) => {
        console.log(response);
        this.allReminders = response;
        this.reminders.next(this.allReminders);
        this.getNotifications();
      });
  }

  notifications = [];
  getNotifications() {
    this.http
      .get<Reminder[]>(this.baseURL + 'reminders/web', {})
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response);
        if (this.notifications.length) {
          this.notifications.forEach((n) => {
            clearTimeout(n);
          });
        }
        response.forEach((r) => {
          if (new Date() < new Date(r.deadline)) {
            let milis = Math.abs(
              new Date(r.deadline).getTime() - new Date().getTime()
            );
            console.log(milis);
            let notificationTimeout = setTimeout(() => {
              var notification = new Notification('Reminders', {
                body: `Your reminder: ${r.name} is due now!`,
              });
              notification.onclick = () => {
                notification.close();
              };
            }, milis);
            this.notifications.push(notificationTimeout);
          }
        });
      });
  }

  createReminder(reminder: Reminder) {
    this.http
      .post<Reminder>(this.baseURL + 'reminders', {
        name: reminder.name,
        deadline: reminder.deadline,
        description: reminder.description,
        notification: reminder.notification,
        creation: reminder.creation,
        callbackUrl:
          reminder.notification === 'API' ? reminder.callbackUrl : '',
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
        callbackUrl:
          reminder.notification === 'API' ? reminder.callbackUrl : '',
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
