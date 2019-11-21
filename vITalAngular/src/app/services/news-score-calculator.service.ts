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
  updateNEWS(respiratoryRate: number, oxygenSaturation: number, supplementalOxygen: boolean,
             systolicBloodPressure: number, pulseRate: number, consciousness: string, temperature: number): number {
    let news3 = 0;
    let news2 = 0;
    let news1 = 0;
    let news0 = 0;
    let newsAgg = 0;
//-----------------------------------respiratoryRate-----------------------------------
    if(respiratoryRate >= 25 || respiratoryRate <=8 ){
      news3 += 1;
    }
    else if(respiratoryRate >= 21 && respiratoryRate <=24 ){
      news2 += 1;
    }
    else if(respiratoryRate >= 9 && respiratoryRate <=11 ){
      news1 += 1;
    }
    else{
      news0 += 1;
    }
//-----------------------------------respiratoryRate-----------------------------------
//-----------------------------------oxygenSaturation-----------------------------------

    if( oxygenSaturation <= 91 ){
      news3 += 1;
    }
    else if(oxygenSaturation >= 92 && oxygenSaturation <= 93 ){
      news2 += 1;
    }
    else if(oxygenSaturation >= 94 && oxygenSaturation <= 95 ){
      news1 += 1;
    }
    else{
      news0 += 1;
    }
//-----------------------------------oxygenSaturation-----------------------------------
//-----------------------------------supplementalOxygen-----------------------------------

    if( supplementalOxygen == true ){
      news2 += 1;
    }
    else{
      news0 += 1;
    }
//-----------------------------------supplementalOxygen-----------------------------------
//-----------------------------------systolicBloodPressure-----------------------------------
    if( systolicBloodPressure <= 90 || systolicBloodPressure >= 220 ){
      news3 += 1;
    }
    else if(systolicBloodPressure >= 91 && systolicBloodPressure <= 100 ){
      news2 += 1;
    }
    else if(systolicBloodPressure >= 101 && systolicBloodPressure <= 110 ){
      news1 += 1;
    }
    else{
      news0 += 1;
    }
//-----------------------------------systolicBloodPressure-----------------------------------
//-----------------------------------pulseRate-----------------------------------
    if( pulseRate <= 31 || pulseRate >= 131 ){
      news3 += 1;
    }
    else if(pulseRate >= 111 && pulseRate <= 130 ){
      news2 += 1;
    }
    else if(pulseRate >= 91 && pulseRate <= 110 ){
      news1 += 1;
    }
    else if(pulseRate >= 41 && pulseRate <= 50 ){
      news1 += 1;
    }
    else{
      news0 += 1;
    }
//-----------------------------------pulseRate-----------------------------------
//-----------------------------------consciousness-----------------------------------
    if( consciousness == "awake" ){
      news0 += 1;
    }
    else{
      news3 += 1;
    }
//-----------------------------------consciousness-----------------------------------
//-----------------------------------temperature-----------------------------------
    if( temperature <= 35 ){
      news3 += 1;
    }
    else if(temperature >= 39.1 ){
      news2 += 1;
    }

    else if(temperature >= 38.1 && temperature <= 39 ){
      news1 += 1;
    }
    else if(temperature >= 36 && temperature <= 35.1 ){
      news1 += 1;
    }
    else{
      news0 += 1;
    }
//-----------------------------------temperature-----------------------------------
    newsAgg = (news1) + (news2 * 2) + (news3 * 3);
    if(newsAgg >= 7 ){
      return 3;
    }
    else if(newsAgg == 6 || newsAgg == 5){
      return 2;
    }
    else if(news3 >= 1){
      return 1;
    }
    else{
      return 0;
    }
  }
}

