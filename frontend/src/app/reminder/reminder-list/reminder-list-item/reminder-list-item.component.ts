import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Reminder } from '../../reminder.model';

@Component({
  selector: 'app-reminder-list-item',
  templateUrl: './reminder-list-item.component.html',
  styleUrls: ['./reminder-list-item.component.css'],
  animations: [
    trigger('smoothCollapse', [
      state(
        'initial',
        style({
          height: '0',
          overflow: 'hidden',
          opacity: '0',
          visibility: 'hidden',
        })
      ),
      state(
        'final',
        style({
          overflow: 'hidden',
        })
      ),
      transition('initial<=>final', animate('250ms')),
    ]),
  ],
})
export class ReminderListItemComponent {
  @Input() reminder;
  @Output('onDelete') deleteEvent = new EventEmitter<Reminder>();
  @Output('onModify') modifyEvent = new EventEmitter<Reminder>();

  showingDescription = false;

  onReminderClicked() {
    this.showingDescription = !this.showingDescription;
  }

  onDelete() {
    this.deleteEvent.emit(this.reminder);
  }

  onModify() {
    this.modifyEvent.emit(this.reminder);
  }

  constructor() {}
}
