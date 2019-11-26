import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {PatientService} from '../../../services/patient.service';
import {DialogWindowComponent} from '../dialog-window/dialog-window.component';
import {timer} from 'rxjs';

@Component({
  selector: 'app-confirm-submit',
  templateUrl: './confirm-submit.component.html',
  styleUrls: ['./confirm-submit.component.css']
})
export class ConfirmSubmitComponent implements OnInit {

  dialogMessage: string;

  constructor(
      private dialogAlert: MatDialogRef<DialogWindowComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private dialog: MatDialog,
      private router: Router,
      private patientService: PatientService,
  ) {
    this.dialogMessage = data.dialogMessage;
  }

  ngOnInit() {
  }

  close() {
    this.dialogAlert.close();
  }

  private viewConfirmation(message: string) {
    const dialogAlConfig = new MatDialogConfig();
    dialogAlConfig.data = {dialogMessage: message};
    dialogAlConfig.disableClose = true;
    dialogAlConfig.autoFocus = true;
    this.dialogAlert = this.dialog.open(DialogWindowComponent, dialogAlConfig);

    this.dialogAlert.afterClosed().subscribe(
    reroute => {
        if (reroute) {
            this.router.navigate(['/scannerpage']);
        } else {
            const source = timer(0, 100);
            const subscribe = source.subscribe(counter => {
                if (counter >= 150) {
                    this.router.navigate(['/scannerpage']);
                    subscribe.unsubscribe();
                }
            });
        }
    },
    error => console.log(error)
    );
  }

  submit() {
      this.patientService.postComposition()
          .subscribe(
              resp => {
                console.log(resp)
                  if (resp.action === 'CREATE') {
                      this.viewConfirmation('Värden sparade');
                  }
              },
              error => {
                  console.log(error);
                  this.viewConfirmation('Ett fel uppstod, värden ej sparade');
              }
          );
      this.close();
  }
}
