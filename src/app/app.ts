import { Component, inject, signal } from '@angular/core';
import { DeviceService } from './services';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private deviceService = inject(DeviceService);
  protected readonly title = signal('ORA Reading Collective');

  ngOnInit() {
    const deviceID = this.deviceService.getDeviceId();
    console.log({ deviceID });
  }
}
