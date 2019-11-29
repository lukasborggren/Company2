import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInputDialogComponent } from './manual-input-dialog.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatDialogModule, MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManualInputDialogComponent', () => {
  let component: ManualInputDialogComponent;
  let fixture: ComponentFixture<ManualInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInputDialogComponent ],
      imports: [BrowserAnimationsModule , MatButtonModule, MatInputModule, MatFormFieldModule, MatDialogModule, ReactiveFormsModule, FormsModule ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
