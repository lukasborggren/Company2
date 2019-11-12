import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://134.209.226.62/api';  // URL to web api

  constructor(private http: HttpClient) {}

  public login(userInfo: User) {
    localStorage.setItem('ACCESS_TOKEN', 'access_token');
    this.isValid(userInfo);
  }

  public isLoggedIn(){
    return localStorage.getItem('ACCESS_TOKEN')!==null;
  }

  public logout(){
    localStorage.removeItem('ACCESS_TOKEN');
  }

  public isValid(userInfo: User){
    //getta patientdata
    /*
    const JSONQuery = {"username":userInfo.username,"password":userInfo.password}
    this.http.get(this.baseUrl + '/authenticate',JSONQuery).subscribe((res) => {
      console.log(res);
    });
    */
    //Checka om username och userpw finns i databasen
    //Om username och PW finns return true
  }

}
