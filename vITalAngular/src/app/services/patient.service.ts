import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'https://rest.ehrscape.com/rest/v1';
  private templateId = 'vital-news2-2019';
  private headers = new HttpHeaders({
    ContentType:  'application/json'
  });

  private jsonComp: any;
  private acvpuCodes = ['at0005', 'at0.15', 'at0006', 'at0007', 'at0008'];
  private rlsCodes = ['at0005', 'at0006', 'at0007', 'at0008', 'at0009', 'at0010', 'at0011', 'at0012'];
  protected paramsMissing = true;

  constructor(private http: HttpClient) { }

  public createJsonComp(breathFreq, oxSat, oxSatScale, onAir, blPrSys, blPrDia,
                        pulse, freq, acvpu, rls, temp, newsScore) {
    this.jsonComp = {
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
      'ctx/health_care_facility|id': '9091'
    };

    let paramCnt = 0;

    if (breathFreq !== '' && breathFreq !== null) {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/andning:0/ospecificerad_händelse:0/frekvens|magnitude': breathFreq,
            'vital-parameters/andning:0/ospecificerad_händelse:0/frekvens|unit': '/min'
          }, this.jsonComp);
    }

    if (onAir !== undefined && onAir !== null) {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/andning:0/ospecificerad_händelse:0/tillfört_syre/enbart_luft': onAir
          }, this.jsonComp);
    }

    if (oxSat !== '' && oxSat !== null) {
      paramCnt++;
      let scaleCom: string;
      oxSatScale === 1 ? scaleCom = 'Bedömning enligt skala 1' : scaleCom = 'Bedömning enligt skala 2';
      this.jsonComp = Object.assign(
          {
            'vital-parameters/pulsoximetri:0/ospecificerad_händelse:0/spo|numerator': oxSat,
            'vital-parameters/pulsoximetri:0/ospecificerad_händelse:0/spo|denominator': 100,
            'vital-parameters/pulsoximetri:0/ospecificerad_händelse:0/tolkning:0': scaleCom
          }, this.jsonComp);
    }

    if (blPrSys !== '' && blPrSys !== null) {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/blodtryck:0/ospecificerad_händelse:0/systoliskt|magnitude': blPrSys,
            'vital-parameters/blodtryck:0/ospecificerad_händelse:0/systoliskt|unit': 'mm[Hg]'
          }, this.jsonComp);
    }

    if (blPrDia !== '' && blPrDia !== null) {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/blodtryck:0/ospecificerad_händelse:0/diastoliskt|magnitude': blPrDia,
            'vital-parameters/blodtryck:0/ospecificerad_händelse:0/diastoliskt|unit': 'mm[Hg]'
          }, this.jsonComp);
    }

    if (acvpu !== '' && acvpu !== null) {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/acvpu:0/any_event:0/observation|code': this.acvpuCodes[acvpu - 1]
          }, this.jsonComp);
    } else if (rls !== '') {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/rls-85:0/any_event:0/observation|code': this.rlsCodes[rls - 1]
          }, this.jsonComp);
    }

    if (temp !== '' && temp !== null) {
      paramCnt++;
      this.jsonComp = Object.assign(
          {
            'vital-parameters/kroppstemperatur:0/ospecificerad_händelse:0/temperatur|magnitude': temp,
            'vital-parameters/kroppstemperatur:0/ospecificerad_händelse:0/temperatur|unit': 'Cel'
          }, this.jsonComp);
    }

    if (pulse !== '' && pulse !== null) {
      paramCnt++;
      let pulseCom: string;
      freq ? pulseCom = 'Värdet erhållet genom att mäta hjärtfrekvens' : pulseCom = 'Värdet erhållet genom att ta puls';
      this.jsonComp = Object.assign(
          {
            'vital-parameters/puls_hjärtfrekvens:0/ospecificerad_händelse:0/frekvens|magnitude': pulse,
            'vital-parameters/puls_hjärtfrekvens:0/ospecificerad_händelse:0/frekvens|unit': '/min',
            'vital-parameters/puls_hjärtfrekvens:0/ospecificerad_händelse:0/kommentar': pulseCom,
          }, this.jsonComp);
    }

    if (newsScore !== 0 && newsScore !== null) {
      this.jsonComp = Object.assign(
          {
            'vital-parameters/news2:0/totalpoäng_news2': newsScore
          }, this.jsonComp);
    }

    paramCnt < 8 ? this.paramsMissing = true : this.paramsMissing = false;
  }

  areParamsMissing(): boolean {
    return this.paramsMissing;
  }

  postComposition(): Observable<any> {
    const httpOptions = {
      headers: this.headers.append('Authorization', 'Basic ' + sessionStorage.getItem('ENCODED_STRING')),
      params: new HttpParams()
          .set('templateId', this.templateId)
          .set('ehrId', sessionStorage.getItem('EHR_ID'))
          .set('format', 'FLAT')
    };
    console.log(this.jsonComp as JSON);
    return this.http.post(this.baseUrl + '/composition', this.jsonComp as JSON, httpOptions);
  }

  public getPatientInformation(pId: string): Observable<any> {
    const httpOptions = {
      headers: this.headers.append('Authorization', 'Basic ' + sessionStorage.getItem('ENCODED_STRING')),
      params: new HttpParams()
          .set('Personnummer', pId)
    };
    return this.http.get(this.baseUrl + '/demographics/party/query', httpOptions);
  }


  public getGenericHistory(measurement: string): Observable <any>{
    const ehrId = sessionStorage.getItem('EHR_ID');
    const aql = (function(measurement){
    switch(measurement){
      case "Respiration":{
        return "select a_b/items[at0057]/value/value as syre, a/context/start_time/value as time, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/magnitude as vitalsign from EHR e[ehr_id/value='"+ ehrId +"'] contains COMPOSITION a contains (OBSERVATION a_a[openEHR-EHR-OBSERVATION.respiration.v1] and CLUSTER a_b[openEHR-EHR-CLUSTER.inspired_oxygen.v1]) order by a/context/start_time desc offset 0 limit 4" ;
      }
      case "Oximetry": {
      return "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0006, 'SpO₂']/value/numerator as vitalsign, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0058, 'Tolkning']/value/value as scale, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.pulse_oximetry.v1] order by a/context/start_time/value desc offset 0 limit 4" ;
    }
    case "bloodPressure": {
      return "select a_a/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value/magnitude as systolic, a_a/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value/magnitude as diastolic, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.blood_pressure.v2] order by a/context/start_time/value desc offset 0 limit 4";
    }
    case "ACVPU": {
       return "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004.1]/value/defining_code as code, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004.1]/value/value as acvpu, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.avpu-c.v0] order by a/context/start_time/value desc offset 0 limit 4";
    }
    case "RLS" :{
      return "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/defining_code as code, a_a/data[at0001]/events[at0002]/data[at0003]/items[at0004]/value/value as rlcscore, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.rls85.v0] order by a/context/start_time/value desc offset 0 limit 4";
    }
    case "Temperature" :{
      return "select a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as vitalsign, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.body_temperature.v2] order by a/context/start_time/value desc offset 0 limit 4";
    }
    case "Pulse": {
    return "select a_a/data[at0002]/events[at0003]/data[at0001]/items[at1059]/value/value as comment, a/context/start_time/value as time, a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as vitalsign from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.pulse.v1] order by a/context/start_time/value desc offset 0 limit 4";
    }
    case "News": {
      return "select a_a/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value/magnitude as news2, a/context/start_time/value as time from EHR e[ehr_id/value='" + ehrId + "'] contains COMPOSITION a contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.news2.v0] order by a/context/start_time/value desc offset 0 limit 4";
    }
    deafault: {
      return "something went wrong"
    }
    }
  })(measurement);
    const httpOptions = {
      headers: this.headers.append('Authorization', 'Basic ' + sessionStorage.getItem('ENCODED_STRING')),
      params: new HttpParams()
          .set('aql', aql )
    };
    return this.http.get(this.baseUrl + '/query', httpOptions);
    }




  public getAllHistory(): Observable<any> {
    const ehrId = sessionStorage.getItem('EHR_ID');
    const aql = "select " +
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
        "order by a/context/start_time/value desc" +
        "offset 0 limit 10";

    const httpOptions = {
      headers: this.headers.append('Authorization', 'Basic ' + sessionStorage.getItem('ENCODED_STRING')),
      params: new HttpParams()
          .set('aql', aql )
    };
    return this.http.get(this.baseUrl + '/query', httpOptions);
  }

}
