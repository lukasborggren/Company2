import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from '@angular/router';
import { BarcodeScannerPageComponent } from './barcode-scanner-page/barcode-scanner-page.component';
import { ManualInputDialogComponent } from './manual-input-dialog/manual-input-dialog.component';
import {MatDialogModule} from '@angular/material';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {path: 'scannerpage', component: BarcodeScannerPageComponent},
  { path: '**', redirectTo: 'login' },
  {path: '', redirectTo: 'scannerpage', pathMatch: 'full'}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes),
    MatDialogModule,
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
