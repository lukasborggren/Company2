import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  showPatient: boolean;

  constructor(
      private location: Location,
      private router: Router
      ) { }

  private goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.routeEvent();
  }

  public goToLogout() {
    this.router.navigate(['/logout']);
  }

  routeEvent(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const currentLocation = event.url;
        this.isLoggedIn = !(currentLocation === '/login' || currentLocation === '/');
        this.showPatient = currentLocation === '/history' || currentLocation.substring(0, 5) === '/pid/';
      }
    });
  }



}
