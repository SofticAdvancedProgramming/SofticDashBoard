import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeafletService {

  private L: any;

  async loadLeaflet(): Promise<any> {
    if (!this.L) {
      this.L = await import('leaflet');
    }
    return this.L;
  }}
