import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BootData, boot, HelloWorld } from '../assets/lib-wasm-old/dotnet.js';

@Injectable({
  providedIn: 'root',
})
export class LibWasmService {
  private wasmReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.instantiateWasm();
  }

  private async instantiateWasm() {
    // Providing implementation for 'GetHostName' function declared in 'HelloWorld' C# assembly.
    HelloWorld.GetHostName = () => 'Browser';

    const assemblyFiles = [
      'Microsoft.JSInterop.WebAssembly.dll',
      'System.Collections.Concurrent.dll',
      'System.Private.Runtime.InteropServices.JavaScript.dll',
      'System.Collections.dll',
      'Microsoft.AspNetCore.Components.Web.dll',
      'System.Memory.dll',
      'Microsoft.JSInterop.dll',
      'Microsoft.AspNetCore.Components.WebAssembly.dll',
      'System.Runtime.dll',
      'System.Text.Json.dll',
      'Microsoft.AspNetCore.Components.dll',
      'System.Private.Uri.dll',
      'System.Private.CoreLib.dll',
      'System.Runtime.CompilerServices.Unsafe.dll',
      'System.Console.dll',
      'DotNetJS.dll',
      'System.Text.Encodings.Web.dll',
      'lib.dll',
    ];

    // Booting the DotNet runtime and invoking entry point.
    const bootData: BootData = {
      wasm: await loadfile('assets/lib-wasm/dotnet.wasm'),
      assemblies: await Promise.all(
        assemblyFiles.map(async (file) => {
          const data = await loadfile('assets/lib-wasm/_framework/' + file);
          return {
            name: file,
            data: data,
          };
        })
      ),
      entryAssemblyName: 'lib.dll',
    };

    /** @ts-ignore */
    await boot(bootData);
    this.wasmReady.next(true);
    // Invoking 'GetName()' C# method defined in 'HelloWorld' assembly.
    const guestName = HelloWorld.GetName();
    console.log(`Welcome, ${guestName}! Enjoy your global space.`);

    // const userName = HelloWorld.GetUser();
    // console.log(`Welcome, ` + userName);
  }

  // public fibonacci(input: number): Observable<number> {
  //   return this.wasmReady.pipe(filter((value) => value === true)).pipe(
  //     map(() => {
  //       return this.module._fibonacci(input);
  //     })
  //   );
  // }
}

async function loadfile(path: string) {
  const response = await fetch(path);
  // Examine the text in the response
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}
