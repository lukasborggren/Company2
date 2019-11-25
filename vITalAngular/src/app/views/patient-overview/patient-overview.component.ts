import {Component, OnInit} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ManualInputDialogComponent} from '../shared-components/manual-input-dialog/manual-input-dialog.component';
import {VerifyPatientDialogComponent} from '../shared-components/verify-patient-dialog/verify-patient-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {isNumeric} from 'rxjs/internal-compatibility';
import {DialogWindowComponent} from '../shared-components/dialog-window/dialog-window.component';
import {ConfirmSubmitComponent} from '../shared-components/confirm-submit/confirm-submit.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsScoreCalculatorService} from '../../services/news-score-calculator.service';
import {throwMatDialogContentAlreadyAttachedError} from '@angular/material/dialog';
import {PopupWindowComponent} from '../shared-components/popup-window/popup-window.component';
import {BarcodeScannerService} from '../../barcode-scanner.service';

@Component({
  selector: 'app-patient-overview',
  templateUrl: './patient-overview.component.html',
  styleUrls: ['./patient-overview.component.css']
})
export class PatientOverviewComponent implements OnInit {
  form: FormGroup;
  patientinfo: string;
  personnumber: string;
  info: string;
  patientInfoEhr: string;
  clinicalRisk: string;

  barcodevalue: string;
  stopScanButtonVisible: boolean;
  pid: string;
  BARCODE_PATTERN = /^([0-9]{8}[a-zA-Z]{1}[0-9]{4})$/;
  PERSONID_PATTERN = /^([0-9]{8}-[0-9]{4})$/;

  respiratoryScore: number;
  saturationScore: number;
  pulseScore: number;
  temperatureScore: number;
  systolicScore: number;
  consciousnessScore: number;
  supplementalOxygenScore: number;
  totalScore: number;
  tempTotal: number;
  accordionState: Array<boolean>; // Icon toggle for the accordion
  scale1: boolean;



    latestRespiration: string;
    latestRespirationTime: any;
    latestOxidation: string;
    latestOxidationTime: string;
    latestOxygen: string;
    latestOxygenTime: any;
    latestSystolic: string;
    latestDiastolic: string;
    latestBPTime: any;
    latestPulse: string;
    latestPulseTime: any;
    latestAlertness: string;
    latestAlertnessTime: any;
    latestTemperature: string;
    latestTemperatureTime: any;


  constructor(
      private patientService: PatientService,
      private route: ActivatedRoute,
      private dialog: MatDialog,
      private fb: FormBuilder,
      private router: Router,
      private newsScoreCalculator: NewsScoreCalculatorService,
      private barcodeScanner: BarcodeScannerService,
  ) {
  }
  startScanner() {
    this.barcodevalue = 'scanning';
    this.stopScanButtonVisible = true;
    this.barcodeScanner.startScanner();
  }

  stopScanner() {
    this.stopScanButtonVisible = false;
    this.barcodeScanner.StopScanner();
  }

  ngOnInit() {
    this.newsScoreCalculator.isEmpty = true;
    const pid = this.route.snapshot.paramMap.get('personid');
    this.personnumber = pid;
    this.form = this.fb.group({
      respiratoryRate: ['', [
        Validators.required,
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      oxygenSaturation: ['', [
        Validators.required,
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      pulseRate: ['', [
        Validators.required,
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      temperature: ['', [
        Validators.required,
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      systolicBloodPressure: ['', [
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      diastolicBloodPressure: ['', [
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      consciousness: ['', [
          Validators.pattern(/^[1-8]$/)
        ]
      ]
    });



    this.patientService.getHistoricRespiration(localStorage.getItem('EHRID')).subscribe(data => {
          this.latestRespiration = data.resultSet[0].vitalsign;
          this.latestRespirationTime = data.resultSet[0].time;
        });
    this.patientService.getHistoricOximetry(localStorage.getItem('EHRID')).subscribe(data => {
          this.latestOxidation = data.resultSet[0].vitalsign;
          this.latestOxidationTime = data.resultSet[0].time;
          if (data.resultSet[0].syre) {
          this.latestOxygen = 'Syre';
        } else {
          this.latestOxygen = 'Luft';
        }

        });
    this.patientService.getHistoricBloodpressure(localStorage.getItem('EHRID')).subscribe(data => {
          this.latestSystolic = data.resultSet[0].systolic;
          this.latestDiastolic = data.resultSet[0].diastolic;
          this.latestBPTime = data.resultSet[0].time;
        });
    this.patientService.getHistoricPulse(localStorage.getItem('EHRID')).subscribe(data => {
          this.latestPulse = data.resultSet[0].vitalsign;
          this.latestPulseTime = data.resultSet[0].time;
        });
    this.patientService.getHistoricACVPU(localStorage.getItem('EHRID')).subscribe(data => {
          this.latestAlertness = data.resultSet[0].acvpu;
          console.log(this.latestAlertness);
          this.latestAlertnessTime = data.resultSet[0].time;

        });
    this.patientService.getHistoricTemperature(localStorage.getItem('EHRID')).subscribe(data => {
          this.latestTemperature = data.resultSet[0].vitalsign;
          this.latestTemperatureTime = data.resultSet[0].time;

        });


    // kolla på touched / invalid

    this.accordionState = [false, false, false, false, false, false, false]; // Icon toggle for the accordion - lite osäker på var jag skulle lägga den
    this.patientService.getPatientInformation(pid).subscribe(data => {
      this.patientInfoEhr = data;
      localStorage.setItem('SUBJECTID', data.parties[0].id);
      this.patientService.getPatientEhrId(localStorage.getItem('SUBJECTID')).subscribe( data => {
        localStorage.setItem('EHRID', data.ehrId);
      });
    });

    this.onChanges();
  }

  onChanges() {
    this.form.get('oxygenSaturation').valueChanges.subscribe(val => {
      this.form.controls.oxygenSaturation.patchValue(val, {emitEvent: false});
      if (this.form.controls.oxygenSaturation.valid) {
        this.saturationScore = this.newsScoreCalculator.getSaturationScore(val);
      } else {
        this.saturationScore = null;
      }
      this.updateTotalNews2Score();
      this.updateClinicalRisk();
      this.updateIsEmpty();
    });
    this.form.get('respiratoryRate').valueChanges.subscribe(val => {
      this.form.controls.respiratoryRate.patchValue(val, {emitEvent: false});
      if (this.form.controls.respiratoryRate.valid) {
        this.respiratoryScore = this.newsScoreCalculator.getRespiratoryScore(val);
      } else {
        this.respiratoryScore = null;
      }
      this.updateTotalNews2Score();
      this.updateClinicalRisk();
      this.updateIsEmpty();
    });
    this.form.get('pulseRate').valueChanges.subscribe(val => {
      this.form.controls.pulseRate.patchValue(val, {emitEvent: false});
      if (this.form.controls.pulseRate.valid) {
        this.pulseScore = this.newsScoreCalculator.getPulseScore(val);
      } else {
        this.pulseScore = null;
      }
      this.updateTotalNews2Score();
      this.updateClinicalRisk();
      this.updateIsEmpty();
    });
    this.form.get('temperature').valueChanges.subscribe(val => {
      this.form.controls.temperature.patchValue(val, {emitEvent: false});
      if (this.form.controls.temperature.valid) {
        this.temperatureScore = this.newsScoreCalculator.getTemperatureScore(val);
      } else {
        this.temperatureScore = null;
      }
      this.updateTotalNews2Score();
      this.updateClinicalRisk();
      this.updateIsEmpty();
    });
    this.form.get('systolicBloodPressure').valueChanges.subscribe(val => {
      this.form.controls.systolicBloodPressure.patchValue(val, {emitEvent: false});
      if (this.form.controls.systolicBloodPressure.valid && this.form.controls.systolicBloodPressure.value) {
        this.systolicScore = this.newsScoreCalculator.getSystolicScore(val);
      } else {
        this.systolicScore = null;
      }
      this.updateTotalNews2Score();
      this.updateClinicalRisk();
      this.updateIsEmpty();
    });

  }
  updateIsEmpty() {
    if ((this.systolicScore == null) && (this.temperatureScore == null ) &&
       (this.pulseScore == null) && (this.respiratoryScore == null) &&
       (this.saturationScore == null) && (this.supplementalOxygenScore == null) &&
       ( this.consciousnessScore == null)) {
         this.newsScoreCalculator.isEmpty = true;
    } else {
      this.newsScoreCalculator.isEmpty = false;
    }

    if ((this.systolicScore == null) || (this.temperatureScore == null ) ||
    (this.pulseScore == null) || (this.respiratoryScore == null) ||
    (this.saturationScore == null) || (this.supplementalOxygenScore == null) ||
    ( this.consciousnessScore == null)) {
      this.newsScoreCalculator.isFull = false;
    } else {
    this.newsScoreCalculator.isFull = true;
 }
  }
  updateSupplementOxygenScore(e, score: number) {
    if (e.target.checked) {
      this.supplementalOxygenScore = score;
    }
    this.updateTotalNews2Score();
    this.updateClinicalRisk();
    this.updateIsEmpty();
  }

  updateConsciousnessScore(e, score: number) {
    if (e.target.checked) {
      this.consciousnessScore = score;
    }
    this.updateTotalNews2Score();
    this.updateClinicalRisk();
    this.updateIsEmpty();
  }

  getConsciousnessScore() {
    return this.consciousnessScore;
  }

  getSupplementOxygenScore() {
    return this.supplementalOxygenScore;
  }


  updateTotalNews2Score() {
    this.updateIsEmpty();
    if (this.getSupplementOxygenScore() != null && this.getConsciousnessScore() != null && this.form.valid) {
      this.totalScore = this.newsScoreCalculator.getTotalNEWS(this.respiratoryScore, this.saturationScore,
          this.supplementalOxygenScore, this.systolicScore, this.pulseScore, this.consciousnessScore,
          this.temperatureScore);
      this.updateClinicalRisk();
    } else {
      this.totalScore = null;
    }
  }


  updateClinicalRisk() {
    if (this.getSupplementOxygenScore() != null && this.getConsciousnessScore() != null && this.form.valid) {
      const temp = this.newsScoreCalculator.getTotalNEWS(this.respiratoryScore, this.saturationScore,
          this.supplementalOxygenScore, this.systolicScore, this.pulseScore, this.consciousnessScore,
          this.temperatureScore);
      if (temp === 0) {
        this.clinicalRisk = 'Låg';
      } else if (temp === 1) {
        this.clinicalRisk = 'Låg/medium';
      } else if (temp === 2) {
        this.clinicalRisk = 'Medium';
      } else if (temp === 3) {
        this.clinicalRisk = 'Hög';
      }
    } else {
      this.clinicalRisk = null;
    }
  }


  toggleAccordion(id: number) { // Icon toggle for the accordion
    this.accordionState[id] = !this.accordionState[id];
  }

  isAccordionOpen(id: number) {
    return this.accordionState[id];
  }

  openPopup(errorMessage: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dialogMessage: errorMessage,
    };

    const dialogRef = this.dialog.open(ConfirmSubmitComponent, dialogConfig);
  }

  // Some fixed mock values at the moment, will be fixed later.
  packVitalsAsJson() {
    this.patientService.createJsonComp(
        this.form.get('respiratoryRate').value,
        this.form.get('oxygenSaturation').value, 1, true,
        this.form.get('systolicBloodPressure').value,
        this.form.get('diastolicBloodPressure').value,
        this.form.get('pulseRate').value, true,
        1, 2,
        this.form.get('temperature').value,
        this.newsScoreCalculator.getTotalScore());
  }

  goToHistory(vitalParameter: string) {
    localStorage.setItem('outputVitalParameter', vitalParameter);
    this.router.navigate(['history']);

    // this.router.navigate(['history'], {state: { outputVitalParameter: vitalParameter}});
  }

}
