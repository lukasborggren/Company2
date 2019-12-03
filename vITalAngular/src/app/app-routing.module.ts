import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes, CanActivate } from '@angular/router';
import { BarcodeScannerPageComponent } from './views/barcode-scanner-page/barcode-scanner-page.component';
import { ManualInputDialogComponent } from './views/shared-components/manual-input-dialog/manual-input-dialog.component';
import { MatDialogModule } from '@angular/material';
import { LoginComponent } from './views/login/login.component';
import { LogoutComponent } from './views/logout/logout.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { AuthGuardTwoService as AuthGuardTwo } from './auth-guard-two.service';
import { PatientOverviewComponent } from './views/patient-overview/patient-overview.component';
import { HistoryComponent } from './views/history/history.component';
import { AuthGuardThreeGuard as AuthGuardThree } from './auth-guard-three.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardTwo] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'scannerpage', component: BarcodeScannerPageComponent, canActivate: [AuthGuard] },
  { path: 'pid/:personid', component: PatientOverviewComponent, canActivate: [AuthGuardThree] },
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
