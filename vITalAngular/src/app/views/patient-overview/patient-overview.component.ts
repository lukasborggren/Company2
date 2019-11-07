import { Component, OnInit } from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-patient-overview',
  templateUrl: './patient-overview.component.html',
  styleUrls: ['./patient-overview.component.css']
})
export class PatientOverviewComponent implements OnInit {
  patientinfo: string;
  personnumber: string;
  info: string;
  respiratoryRate: number;
  oxygenSaturation: number;
  systolicBloodPressure: number;
  systolicBloodPressureUnit: string;
  pulseRate: number;
  temperature: number;
  temperatureUnit: string;
  supplementalOxygen: boolean;
  consciousness: string;

  constructor(
      private patientService: PatientService,
      private route: ActivatedRoute
) {}

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get('personid');
    this.patientService.getPatientDataPid(pid).subscribe(info => {
      this.patientinfo = JSON.stringify(info);
      this.personnumber = info['demographics']['additionalInfo']['Personnummer'];
      this.respiratoryRate = info['breathing_frequency'];
      this.systolicBloodPressure = (info['vital_signs']['blood_pressure'][0]['any_event'][0])['systolic'][0]['|magnitude'];
      this.systolicBloodPressureUnit = (info['vital_signs']['blood_pressure'][0]['any_event'][0]['systolic'][0]['|unit']);
      this.oxygenSaturation = info['oxygen_saturation'];
      this.pulseRate = info['pulse'];
      this.temperature = info['vital_signs']['body_temperature'][0]['any_event'][0]['temperature'][0]['|magnitude'];
      this.temperatureUnit = info['vital_signs']['body_temperature'][0]['any_event'][0]['temperature'][0]['|unit'];
      //TODO: implement an actual check
      this.supplementalOxygen = false;
      this.consciousness = info['alertness'];
    });
  }

}
