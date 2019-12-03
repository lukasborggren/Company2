import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuardThreeGuard } from './auth-guard-three.guard';

describe('AuthGuardThreeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardThreeGuard]
    });
  });

  it('should ...', inject([AuthGuardThreeGuard], (guard: AuthGuardThreeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
