import { Component, OnInit } from '@angular/core';
import {BarcodeScannerService} from '../barcode-scanner.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ManualInputDialogComponent} from '../manual-input-dialog/manual-input-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-barcode-scanner-page',
  templateUrl: './barcode-scanner-page.component.html',
  styleUrls: ['./barcode-scanner-page.component.css']
})
export class BarcodeScannerPageComponent implements OnInit {
  title: 'Scannerpage';
  barcodevalue: string;
  stopScanButtonVisible: boolean;
  pid: string;
  BARCODE_PATTERN = /^([0-9]{8}[a-zA-Z]{1}[0-9]{4})$/
  PERSONID_PATTERN = /^([0-9]{6}-[0-9]{4})$/

  constructor(
      private barcodeScanner: BarcodeScannerService,
      private dialog: MatDialog,
      private router: Router
  ) {
  }

  startScanner() {
    this.barcodevalue = 'scanning';
    this.stopScanButtonVisible = true;
    this.barcodeScanner.startScanner();
  }

  stopScanner() {
    this.stopScanButtonVisible = false;
    this.barcodeScanner.StopScanner();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
    };

    this.dialog.open(ManualInputDialogComponent, dialogConfig);

    const dialogRef = this.dialog.open(ManualInputDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
          if (this.PERSONID_PATTERN.test(data.description)) {
            this.router.navigate(['/pid/' + data.description]);
          }
        });
  }

  ngOnInit() {
    this.stopScanButtonVisible = false;
    this.barcodeScanner.barcodeObs.subscribe(barcode => {
      this.barcodevalue = barcode;
      console.log('barcode: ' + barcode);
      if (this.barcodevalue) {
        this.stopScanButtonVisible = false;
        if (!this.BARCODE_PATTERN.test(barcode)) {
          console.log('Invalid input format');
        } else {
          this.pid = barcode.substr(0, 8) + '-' + barcode.substr(9, 4);
          this.router.navigate(['/pid/' + this.pid]);
        }
      }
    });
  }

}
