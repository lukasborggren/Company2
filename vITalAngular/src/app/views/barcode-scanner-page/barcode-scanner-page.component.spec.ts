import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material';

import { BarcodeScannerPageComponent } from './barcode-scanner-page.component';
import {RouterTestingModule} from '@angular/router/testing';
describe('BarcodeScannerPageComponent', () => {
  let component: BarcodeScannerPageComponent;
  let fixture: ComponentFixture<BarcodeScannerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeScannerPageComponent ],
      imports: [ MatDialogModule, RouterTestingModule ],
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


  it('startScanning() and stopScanning() should toggle stopScanButtonvisible', () => {
    expect(component.stopScanButtonVisible).toBe(false, 'false at beginning');
    component.startScanner();
    expect(component.stopScanButtonVisible).toBe(true, 'true after starting scanning');
    component.stopScanner();
    expect(component.stopScanButtonVisible).toBe(false, 'false after stop scanning');
    component.startScanner();
  });
});
