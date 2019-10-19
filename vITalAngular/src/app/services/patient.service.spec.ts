import { TestBed } from '@angular/core/testing';

import { PatientService } from './patient.service';
import { HttpClientModule } from '@angular/common/http';

describe('PatientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ],
    providers: [ PatientService ]
  }));

  it('should be created', () => {
    const service: PatientService = TestBed.get(PatientService);
    expect(service).toBeTruthy();
  });
});
