import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientOverviewComponent } from './patient-overview.component';
import {ActivatedRoute, convertToParamMap, Data} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

describe('PatientOverviewComponent', () => {
  let component: PatientOverviewComponent;
  let fixture: ComponentFixture<PatientOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientOverviewComponent ],
      imports: [ MatDialogModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({personid: '19921030-0412'})
              }
            }
          }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
