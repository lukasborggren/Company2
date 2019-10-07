import {ChangeDetectorRef, Component} from '@angular/core';
import {BarcodeScannerService} from './barcode-scanner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'vITalAngular';

  constructor(
      private barcodeScanner: BarcodeScannerService,
  ) { }

  startScanner() {
    this.barcodeScanner.startScanner();
  }
}
