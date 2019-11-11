import { Injectable } from '@angular/core';
import { User } from './user';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
      private http: HttpClient
  ) {}

  public login(accessToken: string) {
    localStorage.setItem('ACCESS_TOKEN', accessToken);
  }

  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN')!==null;
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
