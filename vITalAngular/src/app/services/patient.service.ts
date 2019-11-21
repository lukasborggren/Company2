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
  private headers = new HttpHeaders({
    ContentType:  'application/json',
    Authorization: 'Basic ' + localStorage.getItem('ENCODED_STRING')
  });

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

  postComposition(breathFreq, oxSat, oxSatScale, onAir, blPrSys, blPrDia,
                  pulse, freq, acvpu, rls, temp, newsScore): Observable<any> {

    let scaleCom: string;
    let pulseCom: string;
    oxSatScale === 1 ? scaleCom = 'Skala 1' : scaleCom = 'Skala 2';
    freq ? pulseCom = 'Hjärtfrekvens' : pulseCom = 'Ej hjärtfrekvens';

    const httpOptions = {
      headers: this.headers,
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

  public getPatientInformation(pId: string): Observable<any> {
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
          .set('personnummer', pId)
    };
    return this.http.get(this.baseUrl + '/demographics/party/query', httpOptions);
  }

  public getPatientEhrId(subjectId: string): Observable<any> {
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
          .set('subjectId', subjectId)
          .set('subjectNamespace', 'default')
    };
    return  this.http.get(this.baseUrl + '/ehr', httpOptions);
  }

  public getHistoricRespiration(ehrId: string): Observable<any>{
    var aql= "select a_b/items[at0057]/value/value as syre, a/context/start_time/value as time, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude as frequenzy from EHR e[ehr_id/value='"+ ehrId +"'] contains COMPOSITION a contains (OBSERVATION a_a[openEHR-EHR-OBSERVATION.respiration.v1] and CLUSTER a_b[openEHR-EHR-CLUSTER.inspired_oxygen.v1]) order by a/context/start_time offset desc 0 limit 10" ;
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricOximetry(ehrId: string): Observable<any>{
    var aql = "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0006, 'SpO₂']/value/numerator as oxidation, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0058, 'Tolkning']/value/value as scale, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.pulse_oximetry.v1] order by a/context/start_time/value desc offset 0 limit 10" ;
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricBloodpressure(ehrId: string):Observable<any>{
    var aql = "select a_a/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude as systolic, a_a/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude as diastolic, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.blood_pressure.v2] order by a/context/start_time/value desc offset 0 limit 10";
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricACVPU(ehrId: string): Observable<any>{
    var aql = "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004.1]/value/defining_code as code, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004.1]/value/value as acvpu, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.avpu-c.v0] order by a/context/start_time/value desc offset 0 limit 10";
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricRLS(ehrId: string): Observable<any>{
    var aql = "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/defining_code as code, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/value as rlcscore, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.rls85.v0] order by a/context/start_time/value desc offset 0 limit 10";
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricTemperature(ehrId: string): Observable<any>{
    var aql = "select a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as temperature, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.body_temperature.v2] order by a/context/start_time/value desc offset 0 limit 10";
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricPulse(ehrId: string): Observable<any>{
    var aql = "select a_a/data[at0002]/events[at0003]/data[at0001]/items[at1059]/value/value as comment, a/context/start_time/value as time, a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as pulse from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.pulse.v1] order by a/context/start_time/value desc offset 0 limit 10";
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getHistoricTotalNewsScore(ehrId: string):Observable<any>{
    var aql = "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value/magnitude as news2, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.news2.v0] order by a/context/start_time/value desc offset 0 limit 10";
    const httpOptions = {
      headers: this.headers,
      params: new HttpParams()
      .set('aql', aql )
    }
    return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }

  public getAllHistory(ehrId: string): Observable<any> {
    var aql = "select " +
      "a/context/start_time/value as time, " +
      "a_j/data[at0002]/events[at0003]/data[at0001]/items[at1059]/value/value as pulse, " +
      "a_h/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/value as rlcscore, " +
      "a_g/data[at0001]/events[at0002]/data[at0003]/items[at0004.1]/value/value as acvpuScore, " +
      "a_b/items[at0057]/value/value as extraOxygen, " +
      "a_a/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value/magnitude as news2Score, " +
      "a_f/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude as systolic, " +
      "a_f/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude as diastolic , " +
      "a_i/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as temperature, " +
      "a_d/data[at0001]/events[at0002]/data[at0003]/items[at0006, 'SpO₂']/value/numerator as SpO2, " +
      "a_d/data[at0001]/events[at0002]/data[at0003]/items[at0058, 'Tolkning']/value/value as SpO2scale, " +
      "a_c/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude as respiration, " +
      "a_j/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as pulse " +
  "from EHR e[ehr_id/value='" + ehrId + "'] " +
  "contains COMPOSITION a " +
  "contains ( " +
      "OBSERVATION a_a[openEHR-EHR-OBSERVATION.news2.v0] and " +
      "CLUSTER a_b[openEHR-EHR-CLUSTER.inspired_oxygen.v1] and " +
      "OBSERVATION a_c[openEHR-EHR-OBSERVATION.respiration.v1] and " +
      "OBSERVATION a_d[openEHR-EHR-OBSERVATION.pulse_oximetry.v1] and " +
      "OBSERVATION a_f[openEHR-EHR-OBSERVATION.blood_pressure.v2] and " +
      "OBSERVATION a_g[openEHR-EHR-OBSERVATION.avpu-c.v0] and " +
      "OBSERVATION a_h[openEHR-EHR-OBSERVATION.rls85.v0] and " +
      "OBSERVATION a_i[openEHR-EHR-OBSERVATION.body_temperature.v2] and " +
      "OBSERVATION a_j[openEHR-EHR-OBSERVATION.pulse.v1]) " +
  "order by a/context/start_time/value desc " +
  "offset 0 limit 10";

  const httpOptions = {
    headers: this.headers,
    params: new HttpParams()
    .set('aql', aql )
  }
  return this.http.get(this.baseUrl + 'query?aql=' + aql, httpOptions)
  }











  // MOCK FUNCTIONS
  getPatientDataPid(pid: string): Observable<any> {
    return this.http.get(this.mockPatientsUrl + '/pid/' + pid);
  }

  getPatientDataEhr(ehrId: string): Observable<any> {
    return this.http.get(this.mockPatientsUrl + '/ehr/' + ehrId);
  }



}
