import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material';
import { BarcodeScannerService } from 'src/app/barcode-scanner.service';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { FeedDataService } from 'src/app/services/feed-data.service';
import { ManualInputDialogComponent } from '../manual-input-dialog/manual-input-dialog.component';
import {DialogWindowComponent} from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-verify-patient-dialog',
  templateUrl: './verify-patient-dialog.component.html',
  styleUrls: ['./verify-patient-dialog.component.css']
})
export class VerifyPatientDialogComponent implements OnInit {

  form: FormGroup;
  description: string;
  dialogmessage: string;

  barcodevalue: string;
  stopScanButtonVisible: boolean;
  pid: string;
  BARCODE_PATTERN = /^([0-9]{8}[a-zA-Z]{1}[0-9]{4})$/;
  PERSONID_PATTERN = /^([0-9]{8}-[0-9]{4})$/;


  constructor(
      private dialogRef: MatDialogRef<VerifyPatientDialogComponent>,
      private dialogAlert: MatDialogRef<DialogWindowComponent>,
      private fb: FormBuilder,

      private barcodeScanner: BarcodeScannerService,
      private dialog: MatDialog,
      private router: Router,
      private patientService: PatientService,
      private feedData: FeedDataService,

      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.description = data.description;
    this.dialogmessage = data.dialogmessage;
    this.form = this.fb.group({
      description: [this.description, []],
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
          this.feedData.nextPid(this.pid);
          this.router.navigate(['/pid/' + this.pid]);
          this.save();
        }
      }
    });
  }

  close() {
    this.dialogRef.close('close');
  }

  save() {
    this.dialogRef.close(this.form.value);
  }
  scan() {
    this.barcodevalue = 'scanning';
    this.stopScanButtonVisible = true;
    this.barcodeScanner.startScanner();
  }
  stop() {
    this.stopScanButtonVisible = false;
    this.barcodeScanner.StopScanner();
    this.dialogRef.close(this.form.value);
  }




}
