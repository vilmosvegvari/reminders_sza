import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  constructor(private authService: AuthService) {
    this.backendURL = environment.baseURL;
    this.token = this.authService.user.value.token;
  }

  backendURL: string;
  token: string;
}
