import { Injectable } from '@angular/core';
import { User } from './user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
      private http: HttpClient
  ) {
  }

  public login(accessToken: string) {
    localStorage.setItem('ACCESS_TOKEN', accessToken);
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
            }
            ),
            catchError(err => {
              return of(false);
            }));
  }

  public logout() {
    localStorage.removeItem('ACCESS_TOKEN');
  }

  public getUser(userInfo: User): Observable<any> {
    const url = 'http://134.209.226.62/api/login';
    const userInfoJSON = {
      username: userInfo.username,
      password: userInfo.password
    };
    return this.http.post(url, userInfoJSON);
  }
}
