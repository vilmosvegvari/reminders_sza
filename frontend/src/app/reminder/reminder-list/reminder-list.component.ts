import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ReminderService } from '../reminder.service';
import { Reminder } from '../reminder.model';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.css'],
})
export class ReminderListComponent implements OnInit, OnDestroy {
  reminders = [];
  reminderSubscrtiption: Subscription;

  remindertoModify: Reminder;

  constructor(
    private reminderService: ReminderService,
    private modalService: NgbModal
  ) {}

  ngOnDestroy(): void {
    this.reminderSubscrtiption.unsubscribe();
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {
          console.log(reason);
        }
      );
  }

  ngOnInit(): void {
    this.reminderSubscrtiption = this.reminderService.reminders
      .pipe(
        // move map to service when backkend is done
        map((reminders) => {
          return reminders.map((reminder) => {
            return {
              name: reminder.name,
              deadline: reminder.deadline.toLocaleString(),
              creation: reminder.creation.toLocaleString(),
              notification: reminder.notification,
              description: reminder.description,
            };
          });
        })
      )
      .subscribe((reminders) => {
        this.reminders = reminders;
      });

    this.reminderService.getReminders();
  }

  onDeleteItem(reminder) {
    this.reminderService.deleteReminder(reminder.id);
  }

  onModifySaved(newReminder) {
    console.log('elmentett új', newReminder);
    this.reminderService.updateReminder(newReminder);
  }

  onModifyItem(reminder) {
    this.remindertoModify = reminder;
  }
}
