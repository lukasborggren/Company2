import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsScoreCalculatorService {

  constructor() {
  }

  getRespiratoryScore(respiratoryRate: number) {
    if (respiratoryRate >= 25 || respiratoryRate <= 8) {
      return 3;
    } else if (respiratoryRate >= 21 && respiratoryRate <= 24) {
      return 2;
    } else if (respiratoryRate >= 9 && respiratoryRate <= 11) {
      return 1;
    } else {
      return 0;
    }
  }

  getSaturationScore(oxygenSaturation: number) {
    if (oxygenSaturation <= 91) {
      return 3;
    } else if (oxygenSaturation >= 92 && oxygenSaturation <= 93) {
      return 2;
    } else if (oxygenSaturation >= 94 && oxygenSaturation <= 95) {
      return 1;
    } else {
      return 0;
    }
  }

  getSystolicScore(systolicBloodPressure: number) {
    if (systolicBloodPressure <= 90 || systolicBloodPressure >= 220) {
      return 3;
    } else if (systolicBloodPressure >= 91 && systolicBloodPressure <= 100) {
      return 2;
    } else if (systolicBloodPressure >= 101 && systolicBloodPressure <= 110) {
      return 1;
    } else {
      return 0;
    }
  }

  /*
  getDiastolicScore(diastolicBloodPressure: number) {
    if (diastolicBloodPressure <= 90 || diastolicBloodPressure >= 220) {
      return 3;
    } else if (diastolicBloodPressure >= 91 && diastolicBloodPressure <= 100) {
      return 2;
    } else if (diastolicBloodPressure >= 101 && diastolicBloodPressure <= 110) {
      return 1;
    } else {
      return 0;
    }
  }

   */
  getPulseScore(pulseRate: number) {
    if (pulseRate <= 31 || pulseRate >= 131) {
      return 3;
    } else if (pulseRate >= 111 && pulseRate <= 130) {
      return 2;
    } else if (pulseRate >= 91 && pulseRate <= 110) {
      return 1;
    } else if (pulseRate >= 41 && pulseRate <= 50) {
      return 1;
    } else {
      return 0;
    }
  }

  getTemperatureScore(temperature: number) {
    if (temperature <= 35) {
      return 3;
    } else if (temperature >= 39.1) {
      return 2;
    } else if (temperature >= 38.1 && temperature <= 39) {
      return 1;
    } else if (temperature >= 36 && temperature <= 35.1) {
      return 1;
    } else {
      return 0;
    }
  }

  getTotalNEWS(respiratoryScore: number, saturationScore: number, supplementalOxygenScore: number,
               systolicScore: number, pulseScore: number, consciousnessScore: number, temperatureScore: number): number {
    const totalScore = respiratoryScore + saturationScore + supplementalOxygenScore + systolicScore + pulseScore +
        consciousnessScore + temperatureScore;
    if (totalScore >= 7) {
      return 3;
    } else if (totalScore >= 5) {
      return 2;
    } else if (respiratoryScore === 3 || saturationScore === 3 || supplementalOxygenScore === 3 || systolicScore === 3
        || pulseScore === 3 || consciousnessScore === 3 || temperatureScore === 3) {
      return 1;
    } else {
      return 0;
    }
  }
}
