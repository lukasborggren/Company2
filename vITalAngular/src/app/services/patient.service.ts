import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://134.209.226.62/api';  // URL to web api

  constructor(private http: HttpClient) { }

  getPatientDataPid(pid: string): Observable<any> {
    return this.http.get(this.baseUrl + '/pid/' + pid);
  }

  getPatientDataEhr(ehrId: string): Observable<any> {
    return this.http.get(this.baseUrl + '/ehr/' + ehrId);
  }

}

/*import { PatientService } from '../services/patient.service';

---Some class variable----
patientData: any;

---Initialized in constructor---
private patientService: PatientService

this.patientService.getPatientDataPid('19921030-0412').subscribe(
    data => {
      this.patientData = data;
      console.log(data);
    },
    error => console.log('Error when trying to retrieve patient data with personal number.')
);

this.patientService.getPatientDataEhr('8521e620-d38e-4fd6-9071-f785c2ece9b3').subscribe(
    data => {
      this.patientData = data;
      console.log(data);
    },
    error => console.log('Error when trying to retrieve patient data with ehrID.')
);*/
