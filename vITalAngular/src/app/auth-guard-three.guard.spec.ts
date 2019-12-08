import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuardThreeGuard } from './auth-guard-three.guard';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('AuthGuardThreeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardThreeGuard],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
  });

  it('should ...', inject([AuthGuardThreeGuard], (guard: AuthGuardThreeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
