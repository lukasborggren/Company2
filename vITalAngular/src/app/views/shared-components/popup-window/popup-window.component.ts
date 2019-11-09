import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css']
})
export class PopupWindowComponent implements OnInit {

  dialogMessage: string;

  constructor(
      private dialogRef: MatDialogRef<PopupWindowComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.dialogMessage = data.dialogMessage;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}

//Below there is a code piece that you can use in the component from which you want to open the dialog,
// i.e. where the button to open the dialog is. Imports and variables needed.

/*
  constructor(
    private dialog: MatDialog
  ) { }

  openDialog(errorMessage: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dialogMessage: errorMessage
    };
    const dialogRef = this.dialog.open(PopupWindowComponent, dialogConfig);*/
