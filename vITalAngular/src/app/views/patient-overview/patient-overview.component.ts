import {Component, Inject, OnInit} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute} from '@angular/router';
import {ManualInputDialogComponent} from '../shared-components/manual-input-dialog/manual-input-dialog.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {isNumeric} from 'rxjs/internal-compatibility';
import {DialogWindowComponent} from '../shared-components/dialog-window/dialog-window.component';

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
  dialogMessageInput: string;
  private respiratoryConst: string;
  private pulseConst: string;
  private temperatureConst: string;
  private saturationConst: string;
  private pressureConst: string;

  constructor(
      private patientService: PatientService,
      private route: ActivatedRoute,
      private dialog: MatDialog
) {}

  ChangeSupplementalOxygen() {
    /*
    if (confirm('Finns det tillförd syre?')) {
      this.supplementalOxygen = true;
    } else {
      this.supplementalOxygen = false;
    }
    */
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      dialogMessage: 'Finns det tillfört syre?',
      firstOptionMessage: 'Ja',
      secondOptionMessage: 'Nej'
    }
    const dialogRef = this.dialog.open(DialogWindowComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          console.log(data);
          if (data === 'Ja') {
            this.supplementalOxygen = true;
          } else {
            this.supplementalOxygen = false;
          }
        }
    );
  }

  openDialog(variable: string) {
    const dialogConfig = new MatDialogConfig();

    switch (variable) {
      case (this.temperatureConst) :
        this.dialogMessageInput = 'Kroppstemperatur';
        break;
      case (this.pulseConst):
        this.dialogMessageInput = 'Pulsfrekvens';
        break;
      case (this.respiratoryConst):
        this.dialogMessageInput = 'Andningsfrekvens';
        break;
      case (this.pressureConst):
        this.dialogMessageInput = 'Systoliskt Blodtryck';
        break;
      case (this.saturationConst):
        this.dialogMessageInput = 'Syremätnad';
        break;
      default:
        this.dialogMessageInput = '';
    }

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners',
      dialogmessage: this.dialogMessageInput
    };

    const dialogRef = this.dialog.open(ManualInputDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
            if (isNumeric(data.description)) {
              switch (variable) {
                case (this.temperatureConst) :
                  this.temperature = data.description;
                  break;
                case (this.pulseConst):
                  this.pulseRate = data.description;
                  break;
                case (this.respiratoryConst):
                  this.respiratoryRate = data.description;
                  break;
                case (this.pressureConst):
                  this.systolicBloodPressure = data.description;
                  break;
                case (this.saturationConst):
                  this.oxygenSaturation = data.description;
                  break;
              }
              console.log('Dialog output:', data.description);
            }
        });
  }
  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get('personid');
    this.patientService.getPatientDataPid(pid).subscribe(info => {
      this.patientinfo = JSON.stringify(info);
      this.personnumber = info.demographics.additionalInfo.Personnummer;
      this.respiratoryRate = info.breathing_frequency;
      this.systolicBloodPressure = (info.vital_signs.blood_pressure[0].any_event[0]).systolic[0]['|magnitude'];
      this.systolicBloodPressureUnit = (info.vital_signs.blood_pressure[0].any_event[0].systolic[0]['|unit']);
      this.oxygenSaturation = info.oxygen_saturation;
      this.pulseRate = info.pulse;
      this.temperature = info.vital_signs.body_temperature[0].any_event[0].temperature[0]['|magnitude'];
      this.temperatureUnit = info.vital_signs.body_temperature[0].any_event[0].temperature[0]['|unit'];
      // TODO: implement an actual check
      this.supplementalOxygen = false;
      this.consciousness = info.alertness;
    });
    this.respiratoryConst = 'Respiratory';
    this.temperatureConst = 'Temperature';
    this.pressureConst = 'Pressure';
    this.saturationConst = 'Saturation';
    this.pulseConst = 'Pulse';
  }

}
