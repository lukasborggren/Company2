import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  // isLoggedIn: boolean;
  patientOverview: boolean;
  history: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.routeEvent();
  }

  routeEvent(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const currentLocation = event.url;
        // this.isLoggedIn = currentLocation !== '/login';
        this.patientOverview = currentLocation.substring(0, 5) === '/pid/';
        this.history = currentLocation === '/history';
      }
    });
  }

}
