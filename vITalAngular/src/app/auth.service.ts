import { Injectable } from '@angular/core';
import { User } from './user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);

    get isLoggedIn() {
        return this.loggedIn.asObservable(); // {2}
    }

  constructor(
      private http: HttpClient
  ) {}

  public login(userInfo: User): Observable<boolean> {
    const url = 'http://134.209.226.62/api/login';
    const userInfoJSON = {
      username: userInfo.username,
      password: userInfo.password
    };
    return this.http.post<boolean>(url, userInfoJSON)
        .pipe(map((res: any) => {
            const valid = res.status === 'success';
            if (valid) {
                const encodedString = btoa(userInfo.username + ':' + userInfo.password);
                localStorage.setItem('ENCODED_STRING', encodedString);
                localStorage.setItem('ACCESS_TOKEN', res.auth_token);
                this.loggedIn.next(true);
            }
            return valid;
        }),
        catchError(err => {
          return of(false);
        }));
  }

  public checkToken(): Observable<boolean> {
    const url = 'http://134.209.226.62/api/authenticate';
    let headers = new HttpHeaders();
    headers = headers.append(
        'Authorization',
        localStorage.getItem('ACCESS_TOKEN')
    );
    return this.http.get<boolean>(url, {headers: headers})
        .pipe(map((res: any) => {
              return res.status === 'success';
            }),
            catchError(err => {
              return of(false);
            }));
  }

  public logout() {
    const url = 'http://134.209.226.62/api/logout';
    let headers = new HttpHeaders();
    headers = headers.append(
        'Authorization',
        localStorage.getItem('ACCESS_TOKEN')
    );
    this.http.post(url, null, {headers: headers})
        .subscribe((res) => {},
        err => {
          console.error(err);
        });
    localStorage.removeItem('ENCODED_STRING');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('EHR_ID');
    localStorage.removeItem('PID');
    this.loggedIn.next(false);
  }
}
