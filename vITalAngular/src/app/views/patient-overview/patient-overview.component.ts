import {Component, HostListener, OnInit, OnDestroy} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsScoreCalculatorService} from '../../services/news-score-calculator.service';
import {BarcodeScannerService} from '../../barcode-scanner.service';

@Component({
  selector: 'app-patient-overview',
  templateUrl: './patient-overview.component.html',
  styleUrls: ['./patient-overview.component.css']
})
export class PatientOverviewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  patientinfo: string;
  personnumber: string;
  info: string;

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
  tempTotal: number;
  accordionState: Array<boolean>; // Icon toggle for the accordion
  onAir: boolean;

  private acvpuInt: number = null;
  private oxSatScale = 1;
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

  validationOxygenSaturation = true;
  validationTemperature = true;
  validationRespiratoryRate = true;

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

  ngOnDestroy() {
    this.newsScoreCalculator.clinicalRisk = null;
    this.newsScoreCalculator.clinicalRiskText = null;
    const serialized = this.form.getRawValue();
    console.log('form: ', serialized);
    localStorage.setItem('form', JSON.stringify(serialized));
    console.log('form: ',     localStorage.getItem('form'));
  }

  ngOnInit() {
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
      consciousness: ['', [
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


    this.patientService.getHistoricRespiration().subscribe(data => {
      this.latestRespiration = data.resultSet[0].vitalsign;
      this.latestRespirationTime = data.resultSet[0].time;
    });
    this.patientService.getHistoricOximetry().subscribe(data => {
      this.latestOxidation = data.resultSet[0].vitalsign;
      this.latestOxidationTime = data.resultSet[0].time;
      if (data.resultSet[0].syre) {
        this.latestOxygen = 'Syre';
      } else {
        this.latestOxygen = 'Luft';
      }

    });
    this.patientService.getHistoricBloodpressure().subscribe(data => {
      this.latestSystolic = data.resultSet[0].systolic;
      this.latestDiastolic = data.resultSet[0].diastolic;
      this.latestBPTime = data.resultSet[0].time;
    });
    this.patientService.getHistoricPulse().subscribe(data => {
      this.latestPulse = data.resultSet[0].vitalsign;
      this.latestPulseTime = data.resultSet[0].time;
    });
    this.patientService.getHistoricACVPU().subscribe(data => {
      this.latestAlertness = data.resultSet[0].acvpu;
      console.log(this.latestAlertness);
      this.latestAlertnessTime = data.resultSet[0].time;

    });
    this.patientService.getHistoricTemperature().subscribe(data => {
      this.latestTemperature = data.resultSet[0].vitalsign;
      this.latestTemperatureTime = data.resultSet[0].time;

    });

    this.accordionState = [false, false, false, false, false, false, false]; // Icon toggle for the accordion - lite osäker på var jag skulle lägga den
    this.updateCalculations();
    this.onChanges();
  }



  updateCalculations(loadedForm: FormGroup = null) {
    if (loadedForm != null) {
      this.updateScores(loadedForm);
    }
    console.log("hej")
    this.updateTotalNews2Score();
    this.updateClinicalRisk();
    this.updateIsEmpty();
  }

  updateScores(loadedForm) {
    this.updateRespiratoryScore(loadedForm.respiratoryRate);
    this.updateOxygenSaturationScore(loadedForm.oxygenSaturation);
    this.updateOxSatScale(loadedForm.oxSatScale);
    this.updateSupplementalOxygenScore(loadedForm.supplementalOxygen);
    this.updateSystolicBloodPressureScore(loadedForm.systolicBloodPressure);
    this.updatePulseScore(loadedForm.pulseRate);
    this.updateConsciousnessScore(loadedForm.consciousness);
    this.updateTemperatureScore(loadedForm.temperature);
  }

  updateRespiratoryScore(val: number) {
    if (val <= 200 && val >= 0) {
      this.validationRespiratoryRate = true;
    } else {
      this.validationRespiratoryRate = false;
    }
    if (this.form.controls.respiratoryRate.valid && this.validationRespiratoryRate && val != null) {
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
    if (this.form.controls.oxygenSaturation.valid && this.validationOxygenSaturation && val != null) {
      this.saturationScore = this.newsScoreCalculator.getSaturationScore(val);
    } else {
      this.saturationScore = null;
    }
  }

  updateOxSatScale(val: number) {
    if(val == 1) {
      console.log("hej")
      this.oxSatScale = 1;
      this.newsScoreCalculator.oxygenSaturationScale1(true);
    } else {
      this.oxSatScale = 2;
      this.newsScoreCalculator.oxygenSaturationScale1(false);
    }
  }

  updateSupplementalOxygenScore(val: number) {
    if(val == 1) {
      this.supplementalOxygenScore = 2;
      this.onAir = true;
    } else {
      this.supplementalOxygenScore = 0;
      this.onAir = false;
    }
  }

  updateSystolicBloodPressureScore(val: number) {
    if (this.form.controls.systolicBloodPressure.valid && this.form.controls.systolicBloodPressure.value) {
      this.systolicScore = this.newsScoreCalculator.getSystolicScore(val);
    } else {
      this.systolicScore = null;
    }
  }

  updatePulseScore(val:number) {
    if (this.form.controls.pulseRate.valid && val != null) {
      this.pulseScore = this.newsScoreCalculator.getPulseScore(val);
    } else {
      this.pulseScore = null;
    }
  }

  updateConsciousnessScore(val: number) {
    this.acvpuInt = val;
    if(val == 1) {
      this.consciousnessScore = 0;
    } else {
      this.consciousnessScore = 3;
    }
  }

  updateTemperatureScore(val: number) {
    if (val <= 100 && val >= 0) {
      this.validationTemperature = true;
    } else {
      this.validationTemperature = false;
    }
    if (this.form.controls.temperature.valid && this.validationTemperature && val != null) {
      this.temperatureScore = this.newsScoreCalculator.getTemperatureScore(val);
    } else {
      this.temperatureScore = null;
    }
  }

  onChanges() {
    this.form.get('respiratoryRate').valueChanges.subscribe(val => {
      this.updateRespiratoryScore(val)
      this.updateCalculations();
    })
    this.form.get('oxygenSaturation').valueChanges.subscribe(val => {
      this.updateOxygenSaturationScore(val)
      this.updateCalculations();
    });
    this.form.get('oxSatScale').valueChanges.subscribe(val => {
      this.updateOxSatScale(val);
      this.updateCalculations();
    })
    this.form.get('supplementalOxygen').valueChanges.subscribe(val => {
      this.updateSupplementalOxygenScore(val);
      this.updateCalculations();
    })
    this.form.get('systolicBloodPressure').valueChanges.subscribe(val => {
      this.updateSystolicBloodPressureScore(val);
      this.updateCalculations();
    });
    this.form.get('pulseRate').valueChanges.subscribe(val => {
      this.updatePulseScore(val);
      this.updateCalculations();
    });
    this.form.get('consciousness').valueChanges.subscribe(val => {
      this.updateConsciousnessScore(val);
      this.updateCalculations();
    })
    this.form.get('temperature').valueChanges.subscribe(val => {
      this.updateTemperatureScore(val);
      this.updateCalculations();
    });


  }

  @HostListener('click') onClick() {
    localStorage.setItem('TIMER_ACTIVE', 'F');
  }

  updateIsEmpty() {
    if ((this.systolicScore == null) && (this.temperatureScore == null ) &&
    (this.pulseScore == null) && (this.respiratoryScore == null) &&
    (this.saturationScore == null) && (this.supplementalOxygenScore == null) &&
    (  this.consciousnessScore == null)) {
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

  getConsciousnessScore() {
    return this.consciousnessScore;
  }

  getSupplementOxygenScore() {
    return this.supplementalOxygenScore;
  }


  updateTotalNews2Score() {
    this.updateIsEmpty();
    if (this.getSupplementOxygenScore() != null && this.getConsciousnessScore() != null && this.form.valid) {
      this.newsScoreCalculator.getTotalNEWS(this.respiratoryScore, this.saturationScore,
        this.supplementalOxygenScore, this.systolicScore, this.pulseScore, this.consciousnessScore,
        this.temperatureScore);
      this.updateClinicalRisk();
      } else {
        this.newsScoreCalculator.totalScore = null;
      }
    }

    updateClinicalRisk() {
      if (this.getSupplementOxygenScore() != null && this.getConsciousnessScore() != null && this.form.valid) {
        this.newsScoreCalculator.getClinicalRisk();
      }
    }


    toggleAccordion(id: number) { // Icon toggle for the accordion
      this.accordionState[id] = !this.accordionState[id];
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
        this.acvpuInt,
        this.form.get('consciousness').value,
        this.form.get('temperature').value,
        this.newsScoreCalculator.getTotalScore());
      }

      goToHistory(vitalParameter: string) {
        localStorage.setItem('outputVitalParameter', vitalParameter);
        this.router.navigate(['history']);
      }

    }
