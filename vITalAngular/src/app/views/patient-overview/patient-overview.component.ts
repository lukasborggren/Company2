import {Component, HostListener, OnInit, OnDestroy} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsScoreCalculatorService} from '../../services/news-score-calculator.service';
import {BarcodeScannerService} from '../../barcode-scanner.service';
import {FeedDataService} from '../../services/feed-data.service';
import {PhilipsService} from '../../services/philips.service';


@Component({
  selector: 'app-patient-overview',
  templateUrl: './patient-overview.component.html',
  styleUrls: ['./patient-overview.component.css']
})
export class PatientOverviewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  personnumber: string;

  respiratoryScore: number;
  saturationScore: number;
  pulseScore: number;
  temperatureScore: number;
  systolicScore: number;
  consciousnessACVPUScore: number;
  supplementalOxygenScore: number;
  accordionState: Array<boolean>; // Icon toggle for the accordion
  onAir: boolean;

  private oxSatScale = 1;
  scale1: boolean;

  latestRespiration: string;
  latestRespirationTime: any;
  latestOxidation: string;
  latestOxidationTime: string;
  latestOxygen: string;
  latestSystolic: string;
  latestDiastolic: string;
  latestBPTime: any;
  latestPulse: string;
  latestPulseTime: any;
  latestAlertness: string;
  latestAlertnessTime: any;
  latestTemperature: string;
  latestTemperatureTime: any;

  validationRespiratoryRate = true;
  validationOxygenSaturation = true;
  validationSystolic = true;
  validationDiastolic = true;
  validationPulse = true;
  validationRls = true;
  validationTemperature = true;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private newsScoreCalculator: NewsScoreCalculatorService,
    private feedData: FeedDataService,
    private philips: PhilipsService
  ) {
  }

  ngOnDestroy() {
    this.newsScoreCalculator.clinicalRisk = null;
    this.newsScoreCalculator.clinicalRiskText = null;
    const serialized = this.form.getRawValue();
    localStorage.setItem('form', JSON.stringify(serialized));
  }

  ngOnInit() {

    this.accordionState = [false, false, false, false, false, false, false];
    this.newsScoreCalculator.isEmpty = true;
    const pid = this.route.snapshot.paramMap.get('personid');
    this.personnumber = pid;
    this.form = this.fb.group({
      respiratoryRate: ['', [
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      oxygenSaturation: ['', [
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      oxSatScale: ['1', [
        ]
      ],
      supplementalOxygen: ['', [
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
      pulseRate: ['', [
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ],
      consciousnessACVPU: ['', [
        ]
      ],
      rls: ['', [
        Validators.pattern(/^[1-8]$/)
        ]
      ],
      temperature: ['', [
        Validators.pattern(/^([0-9]{1,3}(\.[0-9])?)$/)
        ]
      ]
    });
    if (localStorage.getItem('form') === null) {
      console.log('form = null');
    } else {
      const loadedForm = JSON.parse(localStorage.getItem('form'));
      console.log(loadedForm);
      this.form.patchValue(loadedForm);
      this.updateCalculations(loadedForm);
    }


    this.patientService.getGenericHistory('Respiration').subscribe(data => {
      this.latestRespiration = data.resultSet[0].vitalsign;
      this.latestRespirationTime = data.resultSet[0].time;
    });
    this.patientService.getGenericHistory('Oximetry').subscribe(data => {
      this.latestOxidation = data.resultSet[0].vitalsign;
      this.latestOxidationTime = data.resultSet[0].time;
      if (data.resultSet[0].syre) {
        this.latestOxygen = 'Syre';
      } else {
        this.latestOxygen = 'Luft';
      }

    });
    this.patientService.getGenericHistory('bloodPressure').subscribe(data => {
      this.latestSystolic = data.resultSet[0].systolic;
      this.latestDiastolic = data.resultSet[0].diastolic;
      this.latestBPTime = data.resultSet[0].time;
    });
    this.patientService.getGenericHistory('Pulse').subscribe(data => {
      this.latestPulse = data.resultSet[0].vitalsign;
      this.latestPulseTime = data.resultSet[0].time;
    });
    this.patientService.getGenericHistory('ACVPU').subscribe(data => {
      this.latestAlertness = data.resultSet[0].acvpu;
      this.latestAlertnessTime = data.resultSet[0].time;

    });
    this.patientService.getGenericHistory('Temperature').subscribe(data => {
      this.latestTemperature = data.resultSet[0].vitalsign;
      this.latestTemperatureTime = data.resultSet[0].time;

    });
    this.updateCalculations();
    this.onChanges();
    this.philipsData();
  }



  updateCalculations(loadedForm: FormGroup = null) {
    if (loadedForm != null) {
      this.updateScores(loadedForm);
    }
    this.updateTotalNews2Score();
    this.updateTotalNews2Score();
    this.updateClinicalRisk();
    this.updateIsEmpty();
  }

  updateScores(loadedForm) {
    this.updateRespiratoryScore(loadedForm.respiratoryRate);
    this.updateOxygenSaturationScore(loadedForm.oxygenSaturation);
    this.updateOxSatScale(loadedForm.oxSatScale);
    this.updateSupplementalOxygenScore(loadedForm.supplementalOxygen);
    this.updateOxygenSaturationScore(loadedForm.oxygenSaturation);
    this.updateSystolicBloodPressureScore(loadedForm.systolicBloodPressure);
    this.updatePulseScore(loadedForm.pulseRate);
    this.updateConsciousnessACVPUScore(loadedForm.consciousnessACVPU);
    this.updateTemperatureScore(loadedForm.temperature);
  }

  updateRespiratoryScore(val: number) {
    if (val <= 200 && val >= 0) {
      this.validationRespiratoryRate = true;
    } else {
      this.validationRespiratoryRate = false;
    }
    this.newsScoreCalculator.updateInputValidity(0, this.validationRespiratoryRate);
    if (this.form.controls.respiratoryRate.valid && this.validationRespiratoryRate && this.form.controls.respiratoryRate.value) {
      this.respiratoryScore = this.newsScoreCalculator.getRespiratoryScore(val);
    } else {
      this.respiratoryScore = null;
    }
  }

  updateOxygenSaturationScore(val: number) {
    if (val <= 100 && val >= 0) {
      this.validationOxygenSaturation = true;
    } else {
      this.validationOxygenSaturation = false;
    }
    this.newsScoreCalculator.updateInputValidity(1, this.validationOxygenSaturation);
    if (this.form.controls.oxygenSaturation.valid && this.validationOxygenSaturation && this.form.controls.oxygenSaturation.value) {
      this.saturationScore = this.newsScoreCalculator.getSaturationScore(val);
    } else {
      this.saturationScore = null;
    }
  }

  updateOxSatScale(val: number) {
    if (val == 1) {
      this.oxSatScale = 1;
      this.newsScoreCalculator.oxygenSaturationScale1(this.scale1 = true);
    } else if (val == 2) {
      this.oxSatScale = 2;
      this.newsScoreCalculator.oxygenSaturationScale1(this.scale1 = false);
    }
    const oxygenSaturation = this.form.controls.oxygenSaturation.value;
    if (oxygenSaturation != null && oxygenSaturation !== '') {
      this.updateOxygenSaturationScore(oxygenSaturation);
    }
  }

  updateSupplementalOxygenScore(val: number) {
    if (val == 1) {
      this.supplementalOxygenScore = 2;
      this.onAir = false;
    } else if (val) {
      this.supplementalOxygenScore = 0;
      this.onAir = true;
    }
    this.newsScoreCalculator.setOnAir(this.onAir);
  }

  updateSystolicBloodPressureScore(val: number) {
    if (val <= 999 && val >= 0) {
      this.validationSystolic = true;
    } else {
      this.validationSystolic = false;
    }
    this.newsScoreCalculator.updateInputValidity(2, this.validationSystolic);
    if (this.form.controls.systolicBloodPressure.valid && this.form.controls.systolicBloodPressure.value) {
      this.systolicScore = this.newsScoreCalculator.getSystolicScore(val);
    } else {
      this.systolicScore = null;
    }
  }

  updatePulseScore(val: number) {
    if (val <= 999 && val >= 0) {
      this.validationPulse = true;
    } else {
      this.validationPulse = false;
    }
    this.newsScoreCalculator.updateInputValidity(4, this.validationPulse);
    if (this.form.controls.pulseRate.valid && this.form.controls.pulseRate.value) {
      this.pulseScore = this.newsScoreCalculator.getPulseScore(val);
    } else {
      this.pulseScore = null;
    }
  }

  updateConsciousnessACVPUScore(val: number) {
    if (val == 1) {
      this.consciousnessACVPUScore = 0;
    } else if (val) {
      this.consciousnessACVPUScore = 3;
    }
  }

  updateTemperatureScore(val: number) {
    if (val <= 100 && val >= 0) {
      this.validationTemperature = true;
    } else {
      this.validationTemperature = false;
    }
    this.newsScoreCalculator.updateInputValidity(6, this.validationTemperature);
    if (this.form.controls.temperature.valid && this.validationTemperature && this.form.controls.temperature.value) {
      this.temperatureScore = this.newsScoreCalculator.getTemperatureScore(val);
    } else {
      this.temperatureScore = null;
    }
  }

  onChanges() {
    this.form.get('respiratoryRate').valueChanges.subscribe(val => {
      this.updateRespiratoryScore(val);
      this.updateCalculations();
    });
    this.form.get('oxygenSaturation').valueChanges.subscribe(val => {
      this.updateOxygenSaturationScore(val);
      this.updateCalculations();
    });
    this.form.get('oxSatScale').valueChanges.subscribe(val => {
      this.updateOxSatScale(val);
      this.updateCalculations();
    });
    this.form.get('supplementalOxygen').valueChanges.subscribe(val => {
      this.updateSupplementalOxygenScore(val);
      this.updateCalculations();
      this.updateOxygenSaturationScore(this.form.get('oxygenSaturation').value);
      this.updateCalculations();
    });
    this.form.get('systolicBloodPressure').valueChanges.subscribe(val => {
      this.updateSystolicBloodPressureScore(val);
      this.updateCalculations();
    });
    this.form.get('diastolicBloodPressure').valueChanges.subscribe(val => {
      if (val <= 999 && val >= 0) {
        this.validationDiastolic = true;
      } else {
        this.validationDiastolic = false;
      }
      this.newsScoreCalculator.updateInputValidity(3, this.validationDiastolic);
    });
    this.form.get('pulseRate').valueChanges.subscribe(val => {
      this.updatePulseScore(val);
      this.updateCalculations();
    });
    this.form.get('consciousnessACVPU').valueChanges.subscribe(val => {
      this.updateConsciousnessACVPUScore(val);
      this.updateCalculations();
    });
    this.form.get('rls').valueChanges.subscribe(val => {
      // DO
      // this.updateConsciousnessScore(val);
      // this.updateCalculations();
      if ((val <= 8 && val >= 1) || val == null) {
        this.validationRls = true;
      } else {
        this.validationRls = false;
      }
      console.log('rls ok?', this.validationRls);
      this.newsScoreCalculator.updateInputValidity(5, this.validationRls);
    });
    this.form.get('temperature').valueChanges.subscribe(val => {
      this.updateTemperatureScore(val);
      this.updateCalculations();
    });
  }

  @HostListener('window:click') onClick() {
    console.log('timer off');
    localStorage.setItem('TIMER_ACTIVE', 'F');
  }

  @HostListener('window:scroll') onScroll() {
    localStorage.setItem('TIMER_ACTIVE', 'F');
  }

  updateIsEmpty() {
    if ((this.systolicScore == null) && (this.temperatureScore == null ) &&
    (this.pulseScore == null) && (this.respiratoryScore == null) &&
    (this.saturationScore == null) && (this.supplementalOxygenScore == null) &&
    (  this.consciousnessACVPUScore == null)) {
      this.newsScoreCalculator.isEmpty = true;
    } else {
      this.newsScoreCalculator.isEmpty = false;
    }

    if ((this.systolicScore == null) || (this.temperatureScore == null ) ||
    (this.pulseScore == null) || (this.respiratoryScore == null) ||
    (this.saturationScore == null) || (this.supplementalOxygenScore == null) ||
    ( this.consciousnessACVPUScore == null)) {
      this.newsScoreCalculator.isFull = false;
    } else {
      this.newsScoreCalculator.isFull = true;
    }
  }

  getConsciousnessACVPUScore() {
    return this.consciousnessACVPUScore;
  }

  getSupplementOxygenScore() {
    return this.supplementalOxygenScore;
  }


  updateTotalNews2Score() {
    this.updateIsEmpty();
    if (this.getSupplementOxygenScore() != null && this.getConsciousnessACVPUScore() != null && this.form.valid) {
      this.newsScoreCalculator.getTotalNEWS(this.respiratoryScore, this.saturationScore,
        this.supplementalOxygenScore, this.systolicScore, this.pulseScore, this.consciousnessACVPUScore,
        this.temperatureScore);
      this.updateClinicalRisk();
      } else {
        this.newsScoreCalculator.totalScore = null;
      }
    }

    updateClinicalRisk() {
      if (this.getSupplementOxygenScore() != null && this.getConsciousnessACVPUScore() != null && this.form.valid) {
        this.newsScoreCalculator.getClinicalRisk();
      }
    }


    toggleAccordion(id: number) { // Icon toggle for the accordion

      if(!this.isAccordionOpen(id))
      {
        for (let index = 0; index < this.accordionState.length; index++) {
          this.accordionState[index] = false;
        }
        this.accordionState[id] = true;
      }
      else
      {
        this.accordionState[id] = !this.accordionState[id];
      }
    }

    isAccordionOpen(id: number) {
      return this.accordionState[id];
    }

    packVitalsAsJson() {
      this.patientService.createJsonComp(
        this.form.get('respiratoryRate').value,
        this.form.get('oxygenSaturation').value,
        this.oxSatScale,
        this.onAir,
        this.form.get('systolicBloodPressure').value,
        this.form.get('diastolicBloodPressure').value,
        this.form.get('pulseRate').value,
        true,
        this.form.get('rls').value,
        this.form.get('consciousnessACVPU').value,
        this.form.get('temperature').value,
        this.newsScoreCalculator.getTotalScore());
      }

      goToHistory(vitalParameter: string) {
        localStorage.setItem('outputVitalParameter', vitalParameter);
        this.router.navigate(['history']);
      }

      philipsData() {
        this.feedData.setPhilipsData().subscribe(
            setPhilipsData => {
              if (setPhilipsData) {
                const philipsSubscription = this.philips.getPhilipsData(sessionStorage.getItem('PID')).subscribe(
                    data => {
                      this.form.patchValue({
                        respiratoryRate : data.breathing_rate,
                        systolicBloodPressure: data.systolic_bp,
                        diastolicBloodPressure: data.diastolic_bp,
                        oxygenSaturation: data.oxygen_saturation
                      });
                      philipsSubscription.unsubscribe();
                    });
              }
            });
      }
    }
