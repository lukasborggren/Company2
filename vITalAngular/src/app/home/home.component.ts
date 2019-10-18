import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
      private router: Router,
      private authService: AuthService
  ) { }

  ngOnInit() {
  }

  public goToLogout() {
    this.router.navigate(['/logout']);
  }
  // Function logs data and ends the session after 15 seconds.
  public logData() {
    // Code for logging data
    const source = timer(15000);
    const subscribe = source.subscribe(val => {
      if (val === 0) {
        subscribe.unsubscribe();
        this.authService.logout();
        this.router.navigate(['/login']);
      };
    });
  }
}
