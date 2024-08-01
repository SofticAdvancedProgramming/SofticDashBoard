import { Component, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { LeafletService } from '../../../../services/leafletService/leaflet.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  standalone: true,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  map: any;
  marker: any;

  constructor(private leafletService: LeafletService) {}

  async ngAfterViewInit(): Promise<void> {
    const L = await this.leafletService.loadLeaflet();
    this.initMap(L);
  }

  initMap(L: any): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([24, 12], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.placeMarker(L, e.latlng);
      this.locationSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }

  placeMarker(L: any, latlng: any): void {
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng).addTo(this.map);
    }
  }
}
