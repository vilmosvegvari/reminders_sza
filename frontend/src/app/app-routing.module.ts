import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ReminderComponent } from './reminder/reminder.component';
import { SettingsComponent } from './settings/settings.component';
import { AdminComponent } from './admin/admin.component';

import { AuthGuard } from './auth/auth-guard';
import { AdminGuard } from './admin/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: 'reminders', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'reminders',
    component: ReminderComponent,
    canActivate: [AuthGuard],
  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
