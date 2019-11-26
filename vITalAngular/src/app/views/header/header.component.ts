import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
import {FeedDataService} from '../../services/feed-data.service';
import {PatientService} from '../../services/patient.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  showPatient: boolean;
  pId: string;
  h: string;
  name: string;

  constructor(
      private patientdata: PatientService,
      private location: Location,
      private router: Router,
      private feedData: FeedDataService
      ) { }

  private goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.pId=sessionStorage.getItem('PID');
    this.name=sessionStorage.getItem('NAME');
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
