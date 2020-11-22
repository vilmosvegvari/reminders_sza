import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Reminder } from '../reminder.model';
import { ReminderService } from '../reminder.service';

@Component({
  selector: 'app-reminder-add',
  templateUrl: './reminder-add.component.html',
  styleUrls: ['./reminder-add.component.css'],
})
export class ReminderAddComponent {
  @Input('modify') isModify = false;

  @Input('reminder') remindertoModify: Reminder;

  isLoading = false;
  invalidForm = false;
  selectedNotification: string;

  constructor(
    private reminderService: ReminderService,
    private authService: AuthService
  ) {}

  selectOption(value) {
    this.selectedNotification = value;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.invalidForm = true;
      return;
    }
    this.invalidForm = false;

    const name = form.value.name;
    const deadline = form.value.deadline;
    const description = form.value.description;
    const notification = form.value.notification;
    const creation = new Date();
    let userid;
    if (this.authService.user) {
      userid = this.authService.user.value.id;
    }

    this.reminderService.createReminder(
      name,
      deadline,
      creation,
      description,
      notification,
      userid
    );

    form.reset();
  }
}
