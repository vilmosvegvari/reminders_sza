import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor(private authService: AuthService) {}

  backendURL: string;
  token: string;

  ngOnInit(): void {
    this.backendURL = environment.baseURL;
    this.token = this.authService.user.value.token;
  }
}
