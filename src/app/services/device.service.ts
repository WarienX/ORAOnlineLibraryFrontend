import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private readonly DEVICE_ID_KEY = 'ora_device_id';

  getDeviceId(): string {
    // Try to get existing ID
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);

    if (!deviceId) {
      // Create a fingerprint-based ID
      deviceId = this.generateFingerprint();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
  }

  private generateFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency || 'unknown',
      // Add more if needed
    ];

    const fingerprint = components.join('|');
    return this.hashString(fingerprint);
  }

  private hashString(str: string): string {
    // Simple hash (you can use a better one like sha256 if needed)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return 'device-' + Math.abs(hash).toString(16);
  }
}