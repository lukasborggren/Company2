import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhilipsService {

  constructor(
      private http: HttpClient
  ) {}

  // pId should be on the form "XXXXXXXX-XXXX"
  public getPhilipsData(pID: string): Observable<any> {
    const url = 'https://brewinabox.se/api/philips_mock';
    const body = {
      //PatientPID: '19791111-0017'
      PatientPID: pID
    };
    let headers = new HttpHeaders();
    headers = headers.append(
        'Authorization',
        sessionStorage.getItem('ACCESS_TOKEN')
    );

    return this.http.post<any>(url, body ,{ headers: headers})
        .pipe(map((res: any) => {
          return res.data;
        }));
  }
}
