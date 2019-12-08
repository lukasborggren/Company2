import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedDataService {
  private pid = new Subject<string>();
  private philipsData = new Subject<boolean>();
  private updateLatestData = new Subject<boolean>();

  public nextPid(pid: string) {
    this.pid.next(pid);
  }

  public getPid(): Observable<string> {
    return this.pid.asObservable();
  }

  public nextPhilipsData(getPhilipsData: boolean) {
    this.philipsData.next(getPhilipsData);
  }

  public setPhilipsData(): Observable<boolean> {
    return this.philipsData.asObservable();
  }

  public nextUpdateLatestData(updateLatestData: boolean) {
    this.updateLatestData.next(updateLatestData);
  }

  public getUpdateLatestData(): Observable<boolean> {
    return this.updateLatestData.asObservable();
  }
  constructor() { }
}
