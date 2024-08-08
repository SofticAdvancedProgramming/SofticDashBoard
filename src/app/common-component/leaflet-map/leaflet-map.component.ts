import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})

export class LeafletMapComponent implements OnInit {
  map!: L.Map;
  currentLocationMarker!: L.Marker;
  options: any;
  private marker: any;
  @Input() lat: number = 0;
  @Input() long: number = 0;
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  @Output() getAddress = new EventEmitter<any>();

  private customIcon: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      if (isPlatformBrowser(this.platformId)) {
        import('leaflet').then(L => {
          this.getPlaceDetails(this.lat, this.long, L);
          this.customIcon = L.icon({
            iconUrl: 'assets/images/markerIcon.png',
            iconSize: [25, 41], // Size of the icon
            iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
            popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
            shadowUrl: 'assets/images/marker-shadow.png',
            shadowSize: [41, 41]
          });
          this.initializeMap(L);
        });
      }
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
      center: L.latLng(this.lat, this.long)
    };



    const mapContainer = document.getElementById('map');
    this.map = L.map(mapContainer).setView([this.lat, this.long], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // this.map.on('click', (event: any) => {
    //   this.onMapClick(event, L);
    // });

    // Ensure Leaflet is fully loaded before creating the search control
    setTimeout(() => {
      // Initialize leaflet-search
      const searchControl = new L.Control.Search({
        url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
        jsonpParam: 'json_callback',
        propertyName: 'display_name',
        propertyLoc: ['lat', 'lon'],
        marker: false,
        autoCollapse: true,
        autoType: false,
        minLength: 2
      });

      searchControl.on('search:locationfound', (e: any) => {
        console.log('Search result:', e.latlng);  // Log the latitude and longitude
        this.updateMarker(e.latlng, L);
        this.locationSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
        this.getPlaceDetails(e.latlng.lat, e.latlng.lng, L);
        console.log("search", { lat: e.latlng.lat, lng: e.latlng.lng })
      });

      this.map.addControl(searchControl);
    }, 100); // Adjust the timeout as needed

    // Add custom control for getting the current location
    const currentLocationControl = L.Control.extend({
      options: { position: 'topright' },

      onAdd: (map: L.Map) => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '30px';
        container.style.height = '30px';
        container.style.cursor = 'pointer';
        container.title = 'Get Current Location';

        const icon = L.DomUtil.create('img', '', container);
        icon.src = 'assets/images/currentLocation.png';
        icon.style.width = '100%';
        icon.style.height = '100%';

        container.onclick = () => {
          this.getCurrentLocation(L);
        };

        return container;
      }
    });

    this.map.addControl(new currentLocationControl());
  }

  updateMarker(latlng: any, L: any): void {
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng, { icon: this.customIcon }).addTo(this.map);
    }
  }

  onMapClick(event: any, L: any): void {
    const latlng = event.latlng;
    this.updateMarker(latlng, L);
    this.locationSelected.emit({ lat: latlng.lat, lng: latlng.lng });
  }

  public getCurrentLocation(L: any): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const latlng = L.latLng(lat, lng);
        this.map.setView(latlng, 13);

        this.updateMarker(latlng, L);

        if (this.currentLocationMarker) {
          this.currentLocationMarker.setLatLng(latlng);
        } else {
          this.currentLocationMarker = L.marker(latlng, { icon: this.customIcon }).addTo(this.map)
            .bindPopup('You are here!')
            .openPopup();
        }
        console.log("getCurrentLocation", { lat, lng })

        this.locationSelected.emit({ lat, lng });
        this.getPlaceDetails(lat, lng, L);


      }, (error) => {
        console.error('Geolocation error:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  private getPlaceDetails(lat: number, lon: number, L: any): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const displayName = data.display_name || 'No details available';
        console.log(displayName);
        this.getAddress.emit(data);
        if (this.marker) {
          this.marker.bindPopup(displayName).openPopup();
        }
      })
      .catch(error => {
        console.error('Error fetching place details:', error);
      });
  }
}
