import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {PatientService} from '../../../services/patient.service';
import {DialogWindowComponent} from '../dialog-window/dialog-window.component';
import {timer} from 'rxjs';
import {FeedDataService} from '../../../services/feed-data.service';


@Component({
  selector: 'app-confirm-submit',
  templateUrl: './confirm-submit.component.html',
  styleUrls: ['./confirm-submit.component.css']
})
export class ConfirmSubmitComponent implements OnInit {

  dialogMessage: string;
  questionMessage: string;

  constructor(
      private dialogAlert: MatDialogRef<DialogWindowComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private dialog: MatDialog,
      private router: Router,
      private patientService: PatientService,
      private feedData: FeedDataService
  ) {
    this.dialogMessage = data.dialogMessage;
  }

  ngOnInit() {
      if (this.patientService.areParamsMissing()) {
          this.questionMessage = 'Alla fält är inte ifyllda, vill du spara ändå?';
      } else {
          this.questionMessage = 'Är du säker på att du vill spara?';
      }
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
            localStorage.setItem('TIMER_ACTIVE', 'T');
            const source = timer(0, 100);
            const subscribe = source.subscribe(counter => {
                if (localStorage.getItem('TIMER_ACTIVE') !== 'T') {
                    subscribe.unsubscribe();
                } else if (counter >= 150 ) {
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
                  if (resp.action === 'CREATE') {
                      this.viewConfirmation('Värden sparade');
                      this.close();
                      this.feedData.nextUpdateLatestData(true);
                  }
              },
              error => {
                  this.viewConfirmation('Ett fel uppstod, värden ej sparade');
                  this.close();
              }
          );
      this.close();
  }
}
