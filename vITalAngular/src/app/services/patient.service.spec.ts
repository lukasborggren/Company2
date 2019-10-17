import { TestBed } from '@angular/core/testing';

import { PatientService } from './patient.service';
import { HttpClient } from '@angular/common/http';

describe('PatientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClient ]
  }));

  it('should be created', () => {
    const service: PatientService = TestBed.get(PatientService);
    expect(service).toBeTruthy();
  });
});
