import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import { BarcodeScannerPageComponent } from './barcode-scanner-page.component';
describe('BarcodeScannerPageComponent', () => {
  let component: BarcodeScannerPageComponent;
  let fixture: ComponentFixture<BarcodeScannerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeScannerPageComponent ],
      imports: [ MatDialogModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeScannerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
