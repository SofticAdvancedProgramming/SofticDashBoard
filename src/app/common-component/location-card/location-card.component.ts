import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../../models/company';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from 'node:stream';
import { Location } from '../../../models/Location';
import { EmployeeService } from '../../services/employeeService/employee.service';

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-card.component.html',
  styleUrl: './location-card.component.css'
})
export class LocationCardComponent implements OnInit{
  @Input () _location?:Location;
  lat  ?: number;
  long : number|undefined;
  @Input () Company!:Company;
  private accessToken = 'pk.eyJ1IjoiYWJhbm91Ym1hbnNvdXIiLCJhIjoiY200c2o4d29mMDFlYTJsc2cweWZmZjM0ZiJ9.JAYvHu8gHH7VPrHpuStn9A'
  address: string = '';
  addressArr!:string[];
  private map!: mapboxgl.Map;
  private lang = localStorage.getItem('lang') || 'ar';
  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService){
  }
  ngOnInit():void{
    if (this.map) {

    }
    this.lat=this._location?.lat;
    this.long=this._location?.long;

    this.getAddressFromCoordinates(this.long, this.lat);
  }
  getAddressFromCoordinates(lng: any, lat: any): void {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.accessToken}&language=${this.lang}`;
    this.http.get(url).subscribe({
      next: (response:any) => {
        if (response.features && response.features.length > 0) {
          this.address = this.lang === 'en' ? response.features[0]?.place_name_en : response.features[0]?.place_name;


        this.divide(this.address );
      }
      },
      error:(error:any) => {
        console.error('Error fetching address:', error);
      },
      complete: () => {

      }
    })
  }
  divide(address:string){
    this.addressArr= address.split(',')

  }



}
