import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedDataService {
  private pid = new Subject<string>();

  public nextPid(pid: string) {
    this.pid.next(pid );
  }

  public getPid(): Observable<string> {
    return this.pid.asObservable();
  }
  constructor() { }
}
