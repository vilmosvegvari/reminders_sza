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
  formDeadline: string;
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
      let date = new Date(this.remindertoModify.deadline);
      this.formDeadline = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}T${date.getHours()}:${
        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
      }`; //yyyy-MM-ddThh:mm
      this.formDescription = this.remindertoModify.description;
      this.formNotification = this.remindertoModify.notification;
      this.formCallbackUrl = this.remindertoModify.callbackUrl;
    }
  }

  savedModify() {
    let modified = new Reminder(
      this.remindertoModify.id,
      this.formName,
      new Date(this.formDeadline),
      new Date(),
      this.formDescription,
      this.formNotification,
      this.formNotification === 'API' ? this.formCallbackUrl : ''
    );
    this.savedReminder.emit(modified);
  }

  selectOption(value) {
    this.selectedNotification = value;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.invalidForm = true;
      form.value;
      return;
    }
    this.invalidForm = false;

    let newReminder = new Reminder(
      '',
      this.formName,
      new Date(this.formDeadline),
      new Date(),
      this.formDescription,
      this.formNotification,
      this.formNotification === 'API' ? this.formCallbackUrl : ''
    );
    this.reminderService.createReminder(newReminder);

    form.reset();
    this.selectedNotification = null;
  }
}
