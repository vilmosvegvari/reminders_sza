import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor() {}

  backendURL: string;
  ngOnInit(): void {
    this.backendURL = environment.baseURL;
  }
}
