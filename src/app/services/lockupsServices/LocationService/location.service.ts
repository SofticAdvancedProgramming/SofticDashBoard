import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../../core/services/http-service/HttpService';


@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private countryUrl = `${environment.apiBaseUrl}Country`;
  private cityUrl = `${environment.apiBaseUrl}City`;
  private zoneUrl = `${environment.apiBaseUrl}Zone`;

  constructor(private apiCall: ApiCall) { }

  // Country methods
  getCountries(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.countryUrl}/Get`, request);
  }

  addCountry(country: any): Observable<any> {
    return this.apiCall.request('POST', `${this.countryUrl}/Add`, country);
  }

  editCountry(country: any): Observable<any> {
    return this.apiCall.request('POST', `${this.countryUrl}/Edit`, country);
  }

  deleteCountry(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.countryUrl}/Delete/${id}/${companyId}`, {});
  }

  // City methods
  getCities(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.cityUrl}/Get`, request);
  }

  addCity(city: any): Observable<any> {
    return this.apiCall.request('POST', `${this.cityUrl}/Add`, city);
  }

  editCity(city: any): Observable<any> {
    return this.apiCall.request('POST', `${this.cityUrl}/Edit`, city);
  }

  deleteCity(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.cityUrl}/Delete/${id}/${companyId}`, {});
  }
  getZones(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.zoneUrl}/Get`, request);
  }

  addZone(zone: any): Observable<any> {
    return this.apiCall.request('POST', `${this.zoneUrl}/Add`, zone);
  }

  editZone(zone: any): Observable<any> {
    return this.apiCall.request('POST', `${this.zoneUrl}/Edit`, zone);
  }

  deleteZone(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.zoneUrl}/Delete/${id}}`, {});
  }
}
