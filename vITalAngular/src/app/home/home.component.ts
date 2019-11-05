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
    const source = timer(0, 100);
    const token = localStorage.getItem('ACCESS_TOKEN');
    const subscribe = source.subscribe(val => {
      if (this.authService.isLoggedIn() === false) {
        subscribe.unsubscribe();
      }
      if (val === 150) {
        subscribe.unsubscribe();
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  public goToScanning() {
    this.router.navigate(['/scannerpage']);
  }
}
