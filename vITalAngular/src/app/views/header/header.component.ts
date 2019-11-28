import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  patientOverview: boolean;
  pId: string;
  name: string;
  @Output() philipsData = new EventEmitter<boolean>();

  constructor(
      private patientdata: PatientService,
      private location: Location,
      private router: Router,
      private feedData: FeedDataService
      ) { }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.routeEvent();
  }

  public goToLogout() {
    this.router.navigate(['/logout']);
  }

  public philipsDataOn() {
    this.feedData.nextPhilipsData(true);
  }

  routeEvent() {
    this.router.events.subscribe(event => {
      this.pId = sessionStorage.getItem('PID');
      this.name = sessionStorage.getItem('NAME');
      if (event instanceof NavigationEnd) {
        const currentLocation = event.url;
        this.showPatient = currentLocation === '/history' || currentLocation.substring(0, 5) === '/pid/';
        this.patientOverview = currentLocation.substring(0, 5) === '/pid/';
      }
    });
  }
}
