import {Component, OnInit, ViewChild} from '@angular/core';
import {PatientOverviewComponent} from './views/patient-overview/patient-overview.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'vITal';
  @ViewChild(PatientOverviewComponent, {static: false}) child: PatientOverviewComponent;
  private activeComponent;

  public onSubmit(submit: boolean) {
    this.activeComponent.packVitalsAsJson();
  }

  onActivate(componentReference) {
    this.activeComponent = componentReference;
  }
}
