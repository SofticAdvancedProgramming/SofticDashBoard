import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
})
export class MapComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  options: any;
  private map: any;
  private marker: any;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Load Leaflet only in the browser
      import('leaflet').then(L => {
        this.initializeMap(L);
      });
    }
  }

  initializeMap(L: any): void {
    this.options = {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ],
      zoom: 4,
      center: L.latLng(24, 12)
    };

    const mapContainer = document.getElementById('map');
    this.map = L.map(mapContainer).setView([24, 12], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (event: any) => {
      this.onMapClick(event, L);
    });
  }

  onMapClick(event: any, L: any): void {
    const latlng = event.latlng;
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng).addTo(this.map);
    }
    this.locationSelected.emit({ lat: latlng.lat, lng: latlng.lng });
  }
}
