import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private countryUrl = `${environment.apiBaseUrl}Country`;
  private cityUrl = `${environment.apiBaseUrl}City`;
  private zoneUrl = `${environment.apiBaseUrl}Zone`;

  constructor(private apiCall: ApiCall) {}

  // Country methods
  getCountries(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.countryUrl}/Get`, 'post', request, headers);
  }

  addCountry(country: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.countryUrl}/Add`, 'post', country, headers);
  }

  editCountry(country: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.countryUrl}/Edit`, 'post', country, headers);
  }

  deleteCountry(id: number,companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.countryUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }

  // City methods
  getCities(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.cityUrl}/Get`, 'post', request, headers);
  }

  addCity(city: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.cityUrl}/Add`, 'post', city, headers);
  }

  editCity(city: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.cityUrl}/Edit`, 'post', city, headers);
  }

  deleteCity(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.cityUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
  getZones(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.zoneUrl}/Get`, 'post', request, headers);
  }

  addZone(zone: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.zoneUrl}/Add`, 'post', zone, headers);
  }

  editZone(zone: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.zoneUrl}/Edit`, 'post', zone, headers);
  }

  deleteZone(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.zoneUrl}/Delete/${id}}`, 'post', {}, headers);
  }
}
