import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: Observable<boolean>;

  constructor(
      private authService: AuthService,
      private location: Location
      ) { }

  private goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }
}
