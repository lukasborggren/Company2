import {Component, OnInit} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ManualInputDialogComponent} from '../shared-components/manual-input-dialog/manual-input-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {isNumeric} from 'rxjs/internal-compatibility';
import {DialogWindowComponent} from '../shared-components/dialog-window/dialog-window.component';
import {ConfirmSubmitComponent} from '../shared-components/confirm-submit/confirm-submit.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsScoreCalculatorService} from '../../services/news-score-calculator.service';
import {throwMatDialogContentAlreadyAttachedError} from "@angular/material/dialog";
import {PopupWindowComponent} from "../shared-components/popup-window/popup-window.component";

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
  patientInfoEhr: string;

  newsScore: number;
  newsAgg: number;
  news0: number;
  news1: number;
  news2: number;
  news3: number;

  respiratoryScore:number;
  saturationScore:number;
  pulseScore:number;
  temperatureScore:number;
  systolicScore:number;
  consciousnessScore: number;
  supplementalOxygenScore: number;
  totalScore:number;

  accordionState: Array<boolean>; // Icon toggle for the accordion



  private respiratoryConst: string;
  private pulseConst: string;
  private temperatureConst: string;
  private saturationConst: string;
  private pressureConst: string;
  private diastolicScore: number;

  constructor(
      private patientService: PatientService,
      private route: ActivatedRoute,
      private dialog: MatDialog,
      private fb: FormBuilder,
      private router: Router,
      private newsScoreCalculator: NewsScoreCalculatorService
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
            this.updateNEWS();
        });
  }
  ngOnInit() {


    const pid = this.route.snapshot.paramMap.get('personid');
    this.form = this.fb.group({
      respiratoryRate: ['', [
        Validators.required,
        Validators.pattern('\\-?\\d*\\.?\\d{0,1}')
        ]
      ],
      oxygenSaturation: ['', [
        Validators.required,
        Validators.pattern('\\-?\\d*\\.?\\d{0,1}')
        ]
      ],
      pulseRate: ['', [
        Validators.required,
        Validators.pattern('\\-?\\d*\\.?\\d{0,1}')
        ]
      ],
      temperature: ['', [
        Validators.required,
        Validators.pattern('\\-?\\d*\\.?\\d{0,1}')
        ]
      ],
      systolicBloodPressure: ['', [
        Validators.required,
        Validators.pattern('\\-?\\d*\\.?\\d{0,1}')
        ]
      ],
      diastolicBloodPressure: ['', [
        Validators.required,
        Validators.pattern('\\-?\\d*\\.?\\d{0,1}')
        ]
      ],
      consciousness: ['', [
        Validators.required
        ]
      ]
    });
    // kolla på touched / invalid
    this.accordionState = [false,false,false,false,false,false,false]; //Icon toggle for the accordion - lite osäker på var jag skulle lägga den

    this.patientService.getPatientInformation(pid).subscribe(data=>{
      this.patientInfoEhr=data;
      localStorage.setItem('SUBJECTID', data.parties[0].id);
      this.patientService.getPatientEhrId(localStorage.getItem('SUBJECTID')).subscribe(data =>{
        localStorage.setItem('EHRID', data.ehrId);
      });
    });

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
    this.newsScore = 0;

    this.temperatureScore = 0;
    this.respiratoryScore = 0;
    this.saturationScore = 0;
    this.respiratoryScore = 0;
    this.pulseScore = 0;
    this.systolicScore = 0;
    this.diastolicScore = 0;
    this.onChanges();
  }

  onChanges() {
    this.form.get('oxygenSaturation').valueChanges.subscribe( val => {
      console.log(val);
      this.saturationScore = this.newsScoreCalculator.getSaturationScore(val);
      this.updateTotalNews2Score();
    });
    this.form.get('respiratoryRate').valueChanges.subscribe( val => {
      console.log(val);
      this.respiratoryScore = this.newsScoreCalculator.getRespiratoryScore(val);
      this.updateTotalNews2Score();
    });
    this.form.get('pulseRate').valueChanges.subscribe( val => {
      console.log(val);
      this.pulseScore = this.newsScoreCalculator.getPulseScore(val);
      this.updateTotalNews2Score();
    });
    this.form.get('temperature').valueChanges.subscribe( val => {
      console.log(val);
      this.temperatureScore = this.newsScoreCalculator.getTemperatureScore(val);
      this.updateTotalNews2Score();
    });
    this.form.get('systolicBloodPressure').valueChanges.subscribe( val => {
      console.log(val);
      this.systolicScore = this.newsScoreCalculator.getSystolicScore(val);
      this.updateTotalNews2Score();
    });
    /*
    this.form.get('diastolicBloodPressure').valueChanges.subscribe( val => {
      console.log(val);
      this.diastolicScore = this.newsScoreCalculator.getDiastolicScore(val);
    });
     */
  }


  updateRespiratoryScore() {
    if (this.respiratoryRate >= 25 || this.respiratoryRate <= 8) {
      this.respiratoryScore = 3;
    } else if (this.respiratoryRate >= 21 && this.respiratoryRate <= 24) {
      this.respiratoryScore = 2;
    } else if (this.respiratoryRate >= 9 && this.respiratoryRate <= 11) {
      this.respiratoryScore = 1;
    } else {
      this.respiratoryScore = 0;
    }
    this.updateNEWS();
    return this.respiratoryScore;
  }

  updateSaturationScore() {
    if (this.oxygenSaturation <= 91) {
      this.saturationScore = 3;
    } else if (this.oxygenSaturation >= 92 && this.oxygenSaturation <= 93) {
      this.saturationScore = 2;
    } else if (this.oxygenSaturation >= 94 && this.oxygenSaturation <= 95) {
      this.respiratoryScore = 1;
    } else {
      this.respiratoryScore = 0;
    }
    return this.saturationScore;
  }

  updateSystolicScore() {
    if (this.systolicBloodPressure <= 90 || this.systolicBloodPressure >= 220) {
      this.systolicScore = 3;
    } else if (this.systolicBloodPressure >= 91 && this.systolicBloodPressure <= 100) {
      this.systolicScore = 2;
    } else if (this.systolicBloodPressure >= 101 && this.systolicBloodPressure <= 110) {
      this.systolicScore = 1;
    } else {
      this.systolicScore = 0;
    }
    return this.systolicScore;
  }

  updatePulseScore() {
    if (this.pulseRate <= 31 || this.pulseRate >= 131) {
      this.pulseScore = 3;
    } else if (this.pulseRate >= 111 && this.pulseRate <= 130) {
      this.pulseScore = 2;
    } else if (this.pulseRate >= 91 && this.pulseRate <= 110) {
      this.pulseScore = 1;
    } else if (this.pulseRate >= 41 && this.pulseRate <= 50) {
      this.pulseScore = 1;
    } else {
      this.pulseScore = 0;
    }
    this.updateNEWS();
    return this.pulseScore;
  }

  updateTemperatureScore() {
    if (this.temperature <= 35) {
      this.temperatureScore = 3;
    } else if (this.temperature >= 39.1) {
      this.temperatureScore = 2;
    } else if (this.temperature >= 38.1 && this.temperature <= 39) {
      this.temperatureScore = 1;
    } else if (this.temperature >= 36 && this.temperature <= 35.1) {
      this.temperatureScore = 1;
    } else {
      this.temperatureScore = 0;
    }
    this.updateNEWS();
    return this.temperatureScore;
  }
  updateSupplementOxygenScore(e, score: number) {
    if (e.target.checked) {
      this.supplementalOxygenScore = score;
    }
    this.updateNEWS();
    this.updateTotalNews2Score();
  }
  updateConsciousnessScore(e, score: number) {
    if (e.target.checked) {
      this.consciousnessScore = score;
    }
    this.updateNEWS();
    this.updateTotalNews2Score();
  }

  getConsciousnessScore() {
    return this.consciousnessScore;
  }
  getSupplementOxygenScore() {
    return this.supplementalOxygenScore;
  }

  updateTotalNews2Score() {
    if (this.getSupplementOxygenScore() != null && this.getConsciousnessScore() != null) {
      this.totalScore = this.consciousnessScore + this.pulseScore + this.temperatureScore + this.systolicScore;
      this.totalScore = this.totalScore + this.respiratoryScore + this.saturationScore + this.supplementalOxygenScore;
    }
  }
  getTotalNews2Score() {
    return this.totalScore;
  }

  updateNEWS() {
    this.news3 = 0;
    this.news2 = 0;
    this.news1 = 0;
    this.news0 = 0;
//-----------------------------------respiratoryRate-----------------------------------
    if(this.respiratoryRate >= 25 || this.respiratoryRate <=8 ){
      this.news3 += 1;
    }
    else if(this.respiratoryRate >= 21 && this.respiratoryRate <=24 ){
      this.news2 += 1;
    }
    else if(this.respiratoryRate >= 9 && this.respiratoryRate <=11 ){
      this.news1 += 1;
    }
    else{
      this.news0 += 1;
    }
//-----------------------------------respiratoryRate-----------------------------------
//-----------------------------------oxygenSaturation-----------------------------------

    if( this.oxygenSaturation <= 91 ){
      this.news3 += 1;
    }
    else if(this.oxygenSaturation >= 92 && this.oxygenSaturation <= 93 ){
      this.news2 += 1;
    }
    else if(this.oxygenSaturation >= 94 && this.oxygenSaturation <= 95 ){
      this.news1 += 1;
    }
    else{
      this.news0 += 1;
    }
//-----------------------------------oxygenSaturation-----------------------------------
//-----------------------------------supplementalOxygen-----------------------------------

    if( this.supplementalOxygen == true ){
      this.news2 += 1;
    }
    else{
      this.news0 += 1;
    }
//-----------------------------------supplementalOxygen-----------------------------------
//-----------------------------------systolicBloodPressure-----------------------------------
    if( this.systolicBloodPressure <= 90 || this.systolicBloodPressure >= 220 ){
      this.news3 += 1;
    }
    else if(this.systolicBloodPressure >= 91 && this.systolicBloodPressure <= 100 ){
      this.news2 += 1;
    }
    else if(this.systolicBloodPressure >= 101 && this.systolicBloodPressure <= 110 ){
      this.news1 += 1;
    }
    else{
      this.news0 += 1;
    }
//-----------------------------------systolicBloodPressure-----------------------------------
//-----------------------------------pulseRate-----------------------------------
    if( this.pulseRate <= 31 || this.pulseRate >= 131 ){
      this.news3 += 1;
    }
    else if(this.pulseRate >= 111 && this.pulseRate <= 130 ){
      this.news2 += 1;
    }
    else if(this.pulseRate >= 91 && this.pulseRate <= 110 ){
      this.news1 += 1;
    }
    else if(this.pulseRate >= 41 && this.pulseRate <= 50 ){
      this.news1 += 1;
    }
    else{
      this.news0 += 1;
    }
//-----------------------------------pulseRate-----------------------------------
//-----------------------------------consciousness-----------------------------------
  if( this.consciousness == "awake" ){
    this.news0 += 1;
  }
  else{
    this.news3 += 1;
  }
//-----------------------------------consciousness-----------------------------------
//-----------------------------------temperature-----------------------------------
  if( this.temperature <= 35 ){
    this.news3 += 1;
  }
  else if(this.temperature >= 39.1 ){
    this.news2 += 1;
  }

  else if(this.temperature >= 38.1 && this.temperature <= 39 ){
    this.news1 += 1;
  }
  else if(this.temperature >= 36 && this.temperature <= 35.1 ){
    this.news1 += 1;
  }
  else{
    this.news0 += 1;
  }
//-----------------------------------temperature-----------------------------------
  this.newsAgg = (this.news1) + (this.news2 * 2) + (this.news3 * 3);
  if(this.newsAgg >= 7 ){
    this.newsScore = 3;
  }
  else if(this.newsAgg == 6 || this.newsAgg == 5){
    this.newsScore = 2;
  }
  else if(this.news3 >= 1){
    this.newsScore = 1;
  }
  else{
    this.newsScore = 0;
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
      dialogMessage: errorMessage
    };

    // Example call to the function sending data to database
    this.patientService.postComposition(
        12, 12, 1, true, 30, 20,
        70, true, 'A', 2, 37.1, 3)
        .subscribe(
            data => console.log(data),
            error => console.log(error)
        );

  }
  goToHistory() {
    this.router.navigate(['history']);
  }

}
