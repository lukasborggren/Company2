import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardTwoService implements CanActivate {

  constructor(public authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkToken()
    .pipe(map((valid: boolean) => {
      if (valid) {
        this.router.navigate(['/scannerpage']);
      } else {
        return !valid;
      }
    }));
  }
}
