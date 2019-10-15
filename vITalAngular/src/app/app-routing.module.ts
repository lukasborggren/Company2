import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from '@angular/router';
import { BarcodeScannerPageComponent } from './barcode-scanner-page/barcode-scanner-page.component';
import { ManualInputDialogComponent } from './manual-input-dialog/manual-input-dialog.component';
import {MatDialogModule} from '@angular/material';

const routes: Routes = [
  {path: '', redirectTo: 'scannerpage', pathMatch: 'full'},
  {path: 'scannerpage', component: BarcodeScannerPageComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes),
    MatDialogModule,
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
