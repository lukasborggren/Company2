import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

    constructor(public authService: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> {
        return this.authService.checkToken()
            .pipe(map((valid: boolean) => {
                if (!valid) {
                    this.router.navigate(['login']);
                }
                return valid;
            }));
    }
}
