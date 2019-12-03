import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

//This Authguard prevents a user from accessing patientoverview if they haven't inserted a valid personal id.
@Injectable({
  providedIn: 'root'
})
export class AuthGuardThreeGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(): boolean {
    if (sessionStorage.getItem('EHR_ID') == 'null') {
      return false;
    } else {
      return true;
    }
  }
}
