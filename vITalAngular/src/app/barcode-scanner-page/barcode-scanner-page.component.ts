import { Component, OnInit } from '@angular/core';
import {BarcodeScannerService} from '../barcode-scanner.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ManualInputDialogComponent} from '../manual-input-dialog/manual-input-dialog.component';

@Component({
  selector: 'app-barcode-scanner-page',
  templateUrl: './barcode-scanner-page.component.html',
  styleUrls: ['./barcode-scanner-page.component.css']
})
export class BarcodeScannerPageComponent implements OnInit {
  title: 'Scannerpage';

  constructor(
      private barcodeScanner: BarcodeScannerService,
      private dialog: MatDialog
  ) { }

  startScanner() {
    this.barcodeScanner.startScanner();
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
        data => console.log('Dialog output:', data));
  }

  ngOnInit() {
  }

}
