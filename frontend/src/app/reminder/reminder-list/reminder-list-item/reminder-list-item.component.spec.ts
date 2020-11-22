import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderListItemComponent } from './reminder-list-item.component';

describe('ReminderListItemComponent', () => {
  let component: ReminderListItemComponent;
  let fixture: ComponentFixture<ReminderListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReminderListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
