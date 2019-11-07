import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css']
})
export class PopupWindowComponent implements OnInit {

  description: string;
  errormessage: string;

  constructor(
      private dialogRef: MatDialogRef<PopupWindowComponent>,
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
