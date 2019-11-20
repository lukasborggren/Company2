import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes, CanActivate} from '@angular/router';
import { BarcodeScannerPageComponent } from './views/barcode-scanner-page/barcode-scanner-page.component';
import { ManualInputDialogComponent } from './views/shared-components/manual-input-dialog/manual-input-dialog.component';
import {MatDialogModule} from '@angular/material';
import {HomeComponent} from './views/home/home.component';
import {LoginComponent} from './views/login/login.component';
import {LogoutComponent} from './views/logout/logout.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { PatientOverviewComponent} from './views/patient-overview/patient-overview.component';
import { HistoryComponent } from './views/history/history.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'scannerpage', component: BarcodeScannerPageComponent, canActivate: [AuthGuard] },
  { path: 'pid/:personid', component: PatientOverviewComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
  { path: '', redirectTo: 'scannerpage', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes),
    MatDialogModule,
    CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
