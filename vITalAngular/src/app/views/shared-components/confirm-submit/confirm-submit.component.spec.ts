import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSubmitComponent } from './confirm-submit.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

describe('ConfirmSubmitComponent', () => {
  let component: ConfirmSubmitComponent;
  let fixture: ComponentFixture<ConfirmSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSubmitComponent ],
      imports: [BrowserAnimationsModule, MatButtonModule,  MatDialogModule, ReactiveFormsModule, RouterTestingModule ],
      providers: [{provide : MatDialogRef, useValue : {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
