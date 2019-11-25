import { TestBed } from '@angular/core/testing';

import { AuthGuardTwoService } from './auth-guard-two.service';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuardTwoService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule, RouterTestingModule ]
  }));

  it('should be created', () => {
    const service: AuthGuardTwoService = TestBed.get(AuthGuardTwoService);
    expect(service).toBeTruthy();
  });
});
