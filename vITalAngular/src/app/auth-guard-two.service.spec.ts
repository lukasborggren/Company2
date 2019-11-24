import { TestBed } from '@angular/core/testing';

import { AuthGuardTwoService } from './auth-guard-two.service';

describe('AuthGuardTwoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardTwoService = TestBed.get(AuthGuardTwoService);
    expect(service).toBeTruthy();
  });
});
