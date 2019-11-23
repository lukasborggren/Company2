import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ManualInputDialogComponent} from '../manual-input-dialog/manual-input-dialog.component';
import {VerifyPatientDialogComponent} from '../verify-patient-dialog/verify-patient-dialog.component';
import {PopupWindowComponent} from '../popup-window/popup-window.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-confirm-submit',
  templateUrl: './confirm-submit.component.html',
  styleUrls: ['./confirm-submit.component.css']
})
export class ConfirmSubmitComponent implements OnInit {

  dialogMessage: string;
  PERSONID_PATTERN = /^([0-9]{8}-[0-9]{4})$/

  constructor(
      private dialogRef: MatDialogRef<ConfirmSubmitComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private dialog: MatDialog,
      private router: Router
  ) {
    this.dialogMessage = data.dialogMessage;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  openPersonalIdentification() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners',
      dialogmessage: 'Personnummer'
    };

    const dialogRef = this.dialog.open(VerifyPatientDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          console.log('Dialog output:', data);
          if (this.PERSONID_PATTERN.test(data.description)) {
            this.router.navigate(['/pid/' + data.description]);
          }
        });
  }
}
