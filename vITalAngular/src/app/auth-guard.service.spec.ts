import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('AuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule,  RouterTestingModule.withRoutes([])],
    providers: [ AuthGuardService ]
  }));

  it('should be created', () => {
    const service: AuthGuardService = TestBed.get(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
