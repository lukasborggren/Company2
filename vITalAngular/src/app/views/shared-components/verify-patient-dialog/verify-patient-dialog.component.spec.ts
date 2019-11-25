import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPatientDialogComponent } from './verify-patient-dialog.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';



describe('VerifyPatientDialogComponent', () => {
  let component: VerifyPatientDialogComponent;
  let fixture: ComponentFixture<VerifyPatientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyPatientDialogComponent ],
      imports: [BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                MatButtonModule,
                MatInputModule,
                MatFormFieldModule,
                MatDialogModule,
                ReactiveFormsModule,
                FormsModule ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
