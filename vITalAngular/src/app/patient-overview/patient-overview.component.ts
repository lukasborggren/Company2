import { Component, OnInit } from '@angular/core';
import {PatientService} from '../services/patient.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-patient-overview',
  templateUrl: './patient-overview.component.html',
  styleUrls: ['./patient-overview.component.css']
})
export class PatientOverviewComponent implements OnInit {
  patientinfo: string;
  constructor(
      private patientService: PatientService,
      private route: ActivatedRoute
) {}

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get('personid');
    console.log('pid = ' + pid);
    this.patientService.getPatientDataPid(pid.toString()).subscribe(info => this.patientinfo = JSON.stringify(info))
  }

}
