import { Component } from '@angular/core';
import { LibWasmService } from './lib-wasm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app';

  constructor(private libWasmService: LibWasmService) {
    console.log('loaded');
  }
}
