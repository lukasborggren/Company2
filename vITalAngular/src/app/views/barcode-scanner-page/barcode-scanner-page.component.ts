import { Component, OnInit } from '@angular/core';
import {BarcodeScannerService} from '../../barcode-scanner.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ManualInputDialogComponent} from '../shared-components/manual-input-dialog/manual-input-dialog.component';
import {Router} from '@angular/router';
import {PatientService} from '../../services/patient.service';

@Component({
  selector: 'app-barcode-scanner-page',
  templateUrl: './barcode-scanner-page.component.html',
  styleUrls: ['./barcode-scanner-page.component.css']
})
export class BarcodeScannerPageComponent implements OnInit {

  title: 'Scannerpage';
  barcodeValue: string;
  stopScanButtonVisible: boolean;
  BARCODE_PATTERN = /^([0-9]{8}[a-zA-Z]{1}[0-9]{4})$/;
  PERSONID_PATTERN = /^([0-9]{8}-[0-9]{4})$/;

  constructor(
      private barcodeScanner: BarcodeScannerService,
      private dialog: MatDialog,
      private router: Router,
      private patientService: PatientService,
  ) { }

  ngOnInit() {
    localStorage.removeItem('form');
    this.stopScanButtonVisible = false;
    this.barcodeScanner.barcodeObs.subscribe(barcode => {
      this.barcodeValue = barcode;
      console.log('barcode: ' + barcode);
      if (this.barcodeValue) {
        this.stopScanButtonVisible = false;
        if (!this.BARCODE_PATTERN.test(barcode)) {
          console.log('Invalid input format');
        } else {
          const pid = barcode.substr(0, 8) + '-' + barcode.substr(9, 4);
          this.validPidProvided(pid);
        }
      }
    });
  }

  startScanner() {
    this.barcodeValue = 'scanning';
    this.stopScanButtonVisible = true;
    this.barcodeScanner.startScanner();
  }

  stopScanner() {
    this.stopScanButtonVisible = false;
    this.barcodeScanner.StopScanner();
  }

  openDialog() {
    if (this.stopScanButtonVisible) {
      this.stopScanner();
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners',
      dialogmessage: 'Personnummer'
    };

    const dialogRef = this.dialog.open(ManualInputDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
        data => {
          if (this.PERSONID_PATTERN.test(data.description)) {
            this.validPidProvided(data.description)
          }
        });
  }

  private validPidProvided(pid: string) {
    sessionStorage.setItem('PID', pid);
    this.patientService.getPatientInformation(pid).subscribe(
        response => {
          const ehrId = response.parties[0].additionalInfo.ehrId;
          sessionStorage.setItem('EHR_ID', ehrId);
          sessionStorage.setItem('NAME', response.parties[0].firstNames + ' ' + response.parties[0].lastNames);
          this.router.navigate(['/pid/' + pid]);
        },
        error => console.log(error)
    );
  }

  public goToLogout() {
    this.router.navigate(['/logout']);
  }
}
