import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../core/services/translationService/translation.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnChanges {
  private map!: mapboxgl.Map;
  private markers: mapboxgl.Marker[] = [];
  private roles = JSON.parse(localStorage.getItem('roles')!);
  private lang = localStorage.getItem('lang') || 'ar';
   @Input() locations: { lat: number; long: number; date?: string }[] = [];
  private accessToken = 'pk.eyJ1IjoiYWJhbm91Ym1hbnNvdXIiLCJhIjoiY200c2o4d29mMDFlYTJsc2cweWZmZjM0ZiJ9.JAYvHu8gHH7VPrHpuStn9A'

 
  public selectedAddress: string = '';
  zoom = 8;
  @Input() employee: any = {};
  @Input() lat!: any; 
  @Input() long!: any;
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  userMarker!: mapboxgl.Marker; // Marker for user's location
  constructor(
    private http: HttpClient,
    private translateService: TranslationService,
  ) {
    
    if(this.long!=undefined && this.lat!=undefined)
    {

      this.getAddressFromCoordinates(this.long, this.lat);
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lat'] || changes['long']) {
      if (this.map) {
        this.updateMapLocation();
        this.getAddressFromCoordinates(Number(changes['long']), Number(changes['lat']))
      }
    }
  }

  ngOnInit(): void {
    this.initializeMap();

    if(this.lat==undefined && this.long==undefined)
    {

      this.detectMyLocation();
    }
    
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      modalElement.addEventListener('shown.bs.modal', () => {
        this.map.resize();
      });
    }
  }

  initializeMap(): void {
    // Initialize Mapbox map
    

    if(this.lat==undefined && this.long==undefined)
    {
      this.map = new mapboxgl.Map({
        accessToken: this.accessToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [46.738586, 24.774265],
        zoom: this.zoom,
      });
      this.map.on('load', () => {
        this.setLanguage(this.lang);
        this.addControls();
        this.search();
        this.currentLocation();
       // this.addEmployeeMarkers(46.738586, 24.774265);
      });
    }
    else
    {
      this.map = new mapboxgl.Map({
        accessToken: this.accessToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [this.long,this.lat],
        zoom: this.zoom,
      });
  
      this.map.on('load', () => {
        this.setLanguage(this.lang);
        this.addControls();
        this.search();
        this.currentLocation();
        this.addEmployeeMarkers(this.long,this.lat);
        
      });
    }

   

  }

  detectMyLocation(): void {
    if ('geolocation' in navigator) {

      // Use browser's geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoordinates: [number, number] = [position.coords.longitude, position.coords.latitude];

          this.locationSelected.emit({ lat: position.coords.longitude, lng: position.coords.latitude });
  
          // Fly to user's location on the map
          this.map.flyTo({
            center: userCoordinates, // Correct type: [longitude, latitude]
            zoom: 14, // Zoom level
            essential: true, // Ensures smooth animation
          });
  
          // Add or update a marker for the user's location
          if (this.userMarker) {
            this.userMarker.setLngLat(userCoordinates);
            this.getAddressFromCoordinates(position.coords.longitude,position.coords.latitude);
          } else {
            this.userMarker = new mapboxgl.Marker({ color: 'red' })
              .setLngLat(userCoordinates)
              .addTo(this.map);
              this.getAddressFromCoordinates(position.coords.longitude,position.coords.latitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        
        }
      );
    } else {

    }
  }

  updateMapLocation(): void {
    this.map.setCenter([this.long, this.lat]);
    this.addEmployeeMarkers(this.long, this.lat);
  }

  addControls(): void {
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl());
  }

  addInitialMarker(long: number, lat: number): void {
    const marker = new mapboxgl.Marker().setLngLat([long, lat] as [number, number]).addTo(this.map);
    this.markers.push(marker);
  }

  setLanguage(languageCode: string): void {
    const languageControl = new MapboxLanguage({ defaultLanguage: languageCode });
    this.map.addControl(languageControl);
  }

  search(): void {
    const geocoder = new MapboxGeocoder({
      accessToken: this.accessToken,
      mapboxgl: (mapboxgl as any),
      placeholder: this.translateService.translate('Search for places')
    });

    this.map.addControl(geocoder, 'top-left');

    geocoder.on('result', (event) => {
      const result = event.result;
      const lngLat = result.geometry.coordinates as [number, number];
      this.getAddressFromCoordinates(lngLat[0], lngLat[1]);
      this.clearMarkers();
      const marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(this.map);
      this.markers.push(marker);
      this.map.setCenter(lngLat);
      this.locationSelected.emit({ lat: lngLat[1], lng: lngLat[0] });

    });
  }

  currentLocation(): void {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });

    this.map.addControl(geolocate);

    geolocate.on('geolocate', (event:any) => {
      const lngLat: [number, number] = [event?.coords.longitude, event.coords.latitude];
      this.addEmployeeMarkers(event.coords.longitude, event.coords.latitude)
      this.map.setCenter(lngLat);
      this.map.setZoom(this.zoom);
      this.locationSelected.emit({ lat: lngLat[1], lng: lngLat[0] });
    });
  }

  addEmployeeMarkers(lng: number, lat: number): void {
    // Clear existing markers
    this.clearMarkers();

    // Get address for the new coordinates
    this.getAddressFromCoordinates(lng, lat);

    // Get the employee data either from localStorage or the current employee object
    const employeeData = this.roles[0] === 'Employee'
      ? JSON.parse(localStorage.getItem('user')!)
      : this.employee;

    // Check if employee data contains a profile image
    const profileImage = employeeData?.profileImage || employeeData?.employeeProfileImage;

    if (profileImage) {
      // Create a custom marker element with the profile image
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${profileImage})`;
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.borderRadius = '50%';

      // Create a styled popup with the employee's details
      const popupContent = `
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <h5 style="margin: 0; font-size: 16px; font-weight: bold;">
            ${employeeData.employeeFirstName} ${employeeData.employeeLastName}
          </h5>
          <p style="margin: 5px 0; font-size: 14px; color: #666;">
            ${this.translateService.translate('Phone')}: ${employeeData.employeePhoneNumber}
          </p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      // Add the marker to the map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);

      // Push the marker to the markers array for future reference
      this.markers.push(marker);
    } else {
      // Add a default marker if no profile image is available
      this.addInitialMarker(46.738586, 24.774265);
    }
  }

  clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  getAddressFromCoordinates(lng: number, lat: number): void {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.accessToken}&language=${this.lang}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.features && response.features.length > 0) {
          this.selectedAddress = this.lang === 'en' ? response.features[0]?.place_name_en : response.features[0]?.place_name;

        }
      },
      error: (error) => {
        console.error('Error fetching address:', error);
      },
      complete: () => {

      }
    })
  }
}
