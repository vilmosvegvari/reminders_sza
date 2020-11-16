import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { ReminderComponent } from './reminder/reminder.component';
import { ReminderListComponent } from './reminder/reminder-list/reminder-list.component';
import { ReminderAddComponent } from './reminder/reminder-add/reminder-add.component';
import { SettingsComponent } from './settings/settings.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    ReminderComponent,
    ReminderListComponent,
    ReminderAddComponent,
    SettingsComponent,
    LoadingSpinnerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
