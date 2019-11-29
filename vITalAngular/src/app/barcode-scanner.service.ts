import {ChangeDetectorRef, Injectable} from '@angular/core';
import Quagga from 'quagga';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {
  private barcode: Subject<string> = new Subject<string>();
  public barcodeObs = this.barcode.asObservable();
  configQuagga = {
    inputStream: {
      type : "LiveStream",
      constraints: {
        width: {min: 640},
        height: {min: 480},
        facingMode: "environment",
        aspectRatio: {min: 1, max: 2}
      }
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    locate: true,
    numOfWorkers: 4,
    decoder: {
      readers : [{
        format: "code_128_reader",
        config: {}
      }]
    },
  };

  startScanner() {
    this.barcode.next( '');

    Quagga.onProcessed((result) => this.onProcessed(result));
    Quagga.onDetected((result) => this.logCode(result));

    Quagga.init(this.configQuagga, (err) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
      console.log('Barcode: initialization finished. Ready to start');
    });
  }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
  }


  StopScanner() {
    Quagga.stop();
  }


  private logCode(result) {
    const code = result.codeResult.code;
    if (this.barcode !== code) {
      this.barcode.next(code);
      Quagga.stop();
    }
  }
}
