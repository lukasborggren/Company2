import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-manual-input-dialog',
  templateUrl: './manual-input-dialog.component.html',
  styleUrls: ['./manual-input-dialog.component.css']
})
export class ManualInputDialogComponent implements OnInit {

  form: FormGroup;
  description: string;

  constructor(
      private dialogRef: MatDialogRef<ManualInputDialogComponent>,
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.description = data.description;
    this.form = this.fb.group({
      description: [this.description, []],
    });
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

}
