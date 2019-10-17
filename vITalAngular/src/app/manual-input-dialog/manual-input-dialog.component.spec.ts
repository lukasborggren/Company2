import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInputDialogComponent } from './manual-input-dialog.component';
import {FormBuilder, FormGroup} from '@angular/forms';

describe('ManualInputDialogComponent', () => {
  let component: ManualInputDialogComponent;
  let fixture: ComponentFixture<ManualInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInputDialogComponent ],
      imports: [FormBuilder, FormGroup]
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
