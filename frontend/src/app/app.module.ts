import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { ReminderComponent } from './reminder/reminder.component';
import { ReminderListComponent } from './reminder/reminder-list/reminder-list.component';
import { ReminderAddComponent } from './reminder/reminder-add/reminder-add.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    ReminderComponent,
    ReminderListComponent,
    ReminderAddComponent,
    SettingsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
