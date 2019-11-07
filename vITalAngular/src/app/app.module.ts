import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { BarcodeScannerPageComponent} from './views/barcode-scanner-page/barcode-scanner-page.component';
import { AppRoutingModule } from './app-routing.module';
import { ManualInputDialogComponent } from './views/shared-components/manual-input-dialog/manual-input-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import {RouterModule} from '@angular/router';
import { LogoutComponent } from './views/logout/logout.component';
import { PatientOverviewComponent } from './views/patient-overview/patient-overview.component';

@NgModule({
  declarations: [
    AppComponent,
    BarcodeScannerPageComponent,
    ManualInputDialogComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    PatientOverviewComponent,
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
    HttpClientModule,
    RouterModule
  ],
  entryComponents: [ManualInputDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
