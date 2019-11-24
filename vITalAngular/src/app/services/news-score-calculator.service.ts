import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsScoreCalculatorService {
    clinicalRisk: number;
    totalScore: number;
    isEmpty: boolean;
    scale1: boolean;
  constructor() {
    this.scale1 = true;
  }
  ngOnInit() {
    this.isEmpty = true;
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
    if (this.scale1) {
      if (oxygenSaturation <= 91) {
        return 3;
      } else if (oxygenSaturation >= 92 && oxygenSaturation <= 93) {
        return 2;
      } else if (oxygenSaturation >= 94 && oxygenSaturation <= 95) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (oxygenSaturation <= 83 || oxygenSaturation >= 97 ) {
        return 3;
      } else if (oxygenSaturation >= 83 && oxygenSaturation <= 84) {
        return 2;
      } else if (oxygenSaturation >= 95 && oxygenSaturation <= 96) {
        return 2;
      } else if (oxygenSaturation >= 93 && oxygenSaturation <= 94) {
        return 1;
      } else if (oxygenSaturation >= 86 && oxygenSaturation <= 87) {
        return 1;
      } else {
        return 0;
      }
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
    this.totalScore = respiratoryScore + saturationScore + supplementalOxygenScore + systolicScore + pulseScore +
        consciousnessScore + temperatureScore;
    if (this.totalScore >= 7) {
      this.clinicalRisk = 3;
      return 3;
    } else if (this.totalScore >= 5) {
        this.clinicalRisk =  2;
        return 2;
    } else if (respiratoryScore === 3 || saturationScore === 3 || supplementalOxygenScore === 3 || systolicScore === 3
        || pulseScore === 3 || consciousnessScore === 3 || temperatureScore === 3) {
        this.clinicalRisk =  1;
        return 1;
    } else {
        this.clinicalRisk =  0;
        return 1;
    }
  }
    getClinicalRisk() {
        if (this.clinicalRisk === 0) {
            return 'Låg';
        } else if (this.clinicalRisk === 1) {
            return 'Låg/medium';
        } else if (this.clinicalRisk === 2) {
            return 'Medium';
        } else if (this.clinicalRisk === 3) {
            return 'Hög';
        } else {
    return null;
}
}

oxygenSaturationScale1(e, scale1: boolean) {

  if (e.target.checked) {
      this.scale1 = scale1;
  }
}

getTotalScore() {
      return this.totalScore;
}
}

/*   getSaturationScore(oxygenSaturation: number) {
    if (this.scale1) {
    if (oxygenSaturation <= 91) {
      return 3;
    } else if (oxygenSaturation >= 92 && oxygenSaturation <= 93) {
      return 2;
    } else if (oxygenSaturation >= 94 && oxygenSaturation <= 95) {
      return 1;
    } else {
      return 0;
    }
  } else {
      if (oxygenSaturation <= 83 || oxygenSaturation >= 97 ) {
        return 3;
      } else if (oxygenSaturation >= 83 && oxygenSaturation <= 84) {
        return 2;
      } else if (oxygenSaturation >= 95 && oxygenSaturation <= 96) {
        return 2;
      } else if (oxygenSaturation >= 93 && oxygenSaturation <= 94) {
        return 1;
      } else if (oxygenSaturation >= 86 && oxygenSaturation <= 87) {
        return 1;
      } else {
        return 0;
      }
    }
  }


 */