import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Reminder } from '../reminder.model';
import { ReminderService } from '../reminder.service';

@Component({
  selector: 'app-reminder-add',
  templateUrl: './reminder-add.component.html',
  styleUrls: ['./reminder-add.component.css'],
})
export class ReminderAddComponent implements OnInit {
  @Input('modify') isModify = false;

  @Input('reminder') remindertoModify: Reminder;

  @Output('savedModify') savedReminder = new EventEmitter<Reminder>();

  formName: string;
  formDeadline: Date;
  formDescription: string;
  formNotification: string;
  formCallbackUrl: string;

  isLoading = false;
  invalidForm = false;
  selectedNotification: string;

  constructor(private reminderService: ReminderService) {}
  ngOnInit(): void {
    if (this.remindertoModify) {
      this.formName = this.remindertoModify.name;
      this.formDeadline = this.remindertoModify.deadline;
      this.formDescription = this.remindertoModify.description;
      this.formNotification = this.remindertoModify.notification;
      this.formCallbackUrl = this.remindertoModify.callbackUrl;
    }
  }

  savedModify() {
    let modified = new Reminder(
      this.remindertoModify.id,
      this.formName,
      this.formDeadline,
      new Date(),
      this.formDescription,
      this.formNotification,
      this.formNotification === 'API' ? this.formCallbackUrl : ''
    );
    this.savedReminder.emit(modified);
    console.log(this.formName);
  }

  selectOption(value) {
    this.selectedNotification = value;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.invalidForm = true;
      return;
    }
    this.invalidForm = false;

    console.log(this.formNotification, this.formCallbackUrl);
    let newReminder = new Reminder(
      '',
      this.formName,
      this.formDeadline,
      new Date(),
      this.formDescription,
      this.formNotification,
      this.formNotification === 'API' ? this.formCallbackUrl : ''
    );
    this.reminderService.createReminder(newReminder);

    form.reset();
  }
}
