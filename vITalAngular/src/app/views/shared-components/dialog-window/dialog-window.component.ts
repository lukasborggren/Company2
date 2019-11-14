import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialog-window',
  templateUrl: './dialog-window.component.html',
  styleUrls: ['./dialog-window.component.css']
})
export class DialogWindowComponent implements OnInit {
  dialogMessage: string;
  firstOptionMessage: string;
  secondOptionMessage: string;

  constructor(
      private dialogRef: MatDialogRef<DialogWindowComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogMessage = data.dialogMessage;
    this.firstOptionMessage = data.firstOptionMessage;
    this.secondOptionMessage = data.secondOptionMessage;
  }

  ngOnInit() {
  }

  Close(){
    this.dialogRef.close();
  }



}
