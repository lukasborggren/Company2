import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { BarcodeScannerPageComponent} from './barcode-scanner-page/barcode-scanner-page.component';
import { AppRoutingModule } from './app-routing.module';
import { ManualInputDialogComponent } from './manual-input-dialog/manual-input-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BarcodeScannerPageComponent,
    ManualInputDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  entryComponents: [ManualInputDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
