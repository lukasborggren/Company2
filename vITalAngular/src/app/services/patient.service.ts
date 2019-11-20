import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private mockPatientsUrl = 'http://134.209.226.62/api';  // URL to web api
  private baseUrl = 'https://rest.ehrscape.com/rest/v1';
  private templateId = 'vital-news2-2019';
  private acvpuCodes = ['at0005', 'at0.15', 'at0006', 'at0007', 'at0008'];
  private rlsCodes = ['at0005', 'at0006', 'at0007', 'at0008', 'at0009', 'at0010', 'at0011', 'at0012'];

  constructor(private http: HttpClient) { }

  setAcvpuCode(acvpu) {
    let acvpuCode: string;
    switch (acvpu) {
      case 'A':
        acvpuCode = 'at0005';
        break;
      case 'C':
        acvpuCode = 'at0.15';
        break;
      case 'V':
        acvpuCode = 'at0006';
        break;
      case 'P':
        acvpu = 'at0007';
        break;
      case 'U':
        acvpu = 'at0008';
        break;
    }
    return acvpuCode;
  }

  postComposition(breathFreq, oxSat, oxSatScale, onAir, blPrSys, blPrDia, pulse, freq, acvpu, rls, temp, newsScore) {

    let scaleCom: string;
    let pulseCom: string;
    oxSatScale === 1 ? scaleCom = 'Skala 1' : scaleCom = 'Skala 2';
    freq ? pulseCom = 'Hjärtfrekvens' : pulseCom = 'Ej hjärtfrekvens';

    const httpOptions = {
      headers: new HttpHeaders({
        ContentType:  'application/json',
        Authorization: 'Basic ' + localStorage.getItem('ENCODED_STRING')
      }),
      params: new HttpParams()
          .set('templateId', this.templateId)
          .set('ehrId', 'c1e2c1ea-e295-4c59-92be-5e83534d6106') // Ändra så att session-aktuellt EHR ID används
          .set('format', 'FLAT')
    };

    const jsonComp = {
      'ctx/language': 'sv',
      'ctx/territory': 'US',
      'ctx/composer_name': 'Silvia Blake',
      'ctx/id_namespace': 'HOSPITAL-NS',
      'ctx/id_scheme': 'HOSPITAL-NS',
      'ctx/participation_name': 'Dr. Marcus Johnson',
      'ctx/participation_function': 'requester',
      'ctx/participation_mode': 'face-to-face communication',
      'ctx/participation_id': '199',
      'ctx/participation_name:1': 'Lara Markham',
      'ctx/participation_function:1': 'performer',
      'ctx/participation_id:1': '198',
      'ctx/health_care_facility|name': 'Hospital',
      'ctx/health_care_facility|id': '9091',
      'vital-parameters/andning:0/ospecificerad_händelse:0/frekvens|magnitude': breathFreq,
      'vital-parameters/andning:0/ospecificerad_händelse:0/frekvens|unit': '/min',
      'vital-parameters/andning:0/ospecificerad_händelse:0/tillfört_syre/enbart_luft': onAir,
      'vital-parameters/pulsoximetri:0/ospecificerad_händelse:0/spo|numerator': oxSat,
      'vital-parameters/pulsoximetri:0/ospecificerad_händelse:0/spo|denominator': 100,
      'vital-parameters/pulsoximetri:0/ospecificerad_händelse:0/tolkning:0': scaleCom,
      'vital-parameters/blodtryck:0/ospecificerad_händelse:0/systoliskt|magnitude': blPrSys,
      'vital-parameters/blodtryck:0/ospecificerad_händelse:0/systoliskt|unit': 'mm[Hg]',
      'vital-parameters/blodtryck:0/ospecificerad_händelse:0/diastoliskt|magnitude': blPrDia,
      'vital-parameters/blodtryck:0/ospecificerad_händelse:0/diastoliskt|unit': 'mm[Hg]',
      'vital-parameters/acvpu:0/any_event:0/observation|code': this.setAcvpuCode(acvpu),
      'vital-parameters/rls-85:0/any_event:0/observation|code': this.rlsCodes[rls],
      'vital-parameters/kroppstemperatur:0/ospecificerad_händelse:0/temperatur|magnitude': temp,
      'vital-parameters/kroppstemperatur:0/ospecificerad_händelse:0/temperatur|unit': 'Cel',
      'vital-parameters/puls_hjärtfrekvens:0/ospecificerad_händelse:0/frekvens|magnitude': pulse,
      'vital-parameters/puls_hjärtfrekvens:0/ospecificerad_händelse:0/frekvens|unit': '/min',
      'vital-parameters/puls_hjärtfrekvens:0/ospecificerad_händelse:0/kommentar': pulseCom,
      'vital-parameters/news2:0/totalpoäng_news2': newsScore
    };
    return this.http.post(this.baseUrl + '/composition', jsonComp, httpOptions);
  }

  getPatientDataPid(pid: string): Observable<any> {
    return this.http.get(this.mockPatientsUrl + '/pid/' + pid);
  }

  getPatientDataEhr(ehrId: string): Observable<any> {
    return this.http.get(this.mockPatientsUrl + '/ehr/' + ehrId);
  }

}
