import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-verify-patient-dialog',
  templateUrl: './verify-patient-dialog.component.html',
  styleUrls: ['./verify-patient-dialog.component.css']
})
export class VerifyPatientDialogComponent implements OnInit {

  form: FormGroup;
  description: string;
  dialogmessage: string;

  constructor(
      private dialogRef: MatDialogRef<VerifyPatientDialogComponent>,
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.description = data.description;
    this.dialogmessage = data.dialogmessage;
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
