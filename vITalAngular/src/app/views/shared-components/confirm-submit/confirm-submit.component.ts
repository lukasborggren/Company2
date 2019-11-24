import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VerifyPatientDialogComponent} from '../verify-patient-dialog/verify-patient-dialog.component';
import {Router} from '@angular/router';
import {PatientService} from '../../../services/patient.service';

@Component({
  selector: 'app-confirm-submit',
  templateUrl: './confirm-submit.component.html',
  styleUrls: ['./confirm-submit.component.css']
})
export class ConfirmSubmitComponent implements OnInit {

  dialogMessage: string;

  constructor(
      private dialogRef: MatDialogRef<ConfirmSubmitComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private dialog: MatDialog,
      private router: Router,
      private patientService: PatientService
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
          if (data.description === localStorage.getItem('PID')) {
            this.patientService.postComposition()
                .subscribe(
                    resp => {
                      // Confirmation alert here
                      if (resp.action === 'CREATE') {
                        console.log('Submission successful');
                        this.router.navigate(['/pid/' + data.description]);
                      }
                    },
                    error => {
                      // Error alert here
                      console.log(error);
                      console.log('Submission failed');
                    }
                );
          } else {
            console.log('Wrong PID entered');
          }
        });
  }
}
