import {Component, OnInit, ViewChild} from '@angular/core';
import {PatientOverviewComponent} from './views/patient-overview/patient-overview.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'vITal';

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  @ViewChild(PatientOverviewComponent, {static: false}) child: PatientOverviewComponent;
  private activeComponent;

  public onSubmit(submit: boolean) {
    this.activeComponent.packVitalsAsJson();
  }

  onActivate(componentReference) {
    this.activeComponent = componentReference;
  }
}
