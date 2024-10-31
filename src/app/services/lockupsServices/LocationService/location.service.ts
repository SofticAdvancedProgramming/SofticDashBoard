import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { locationController } from '../../../apis/locationController';
 
@Injectable({
  providedIn: 'root',
})
export class LocationService {

  constructor(private apiCall: ApiCall) { }

  // Country methods
  getCountries(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', locationController.country.get, request);
  }

  addCountry(country: any): Observable<any> {
    return this.apiCall.request('POST', locationController.country.add, country);
  }

  editCountry(country: any): Observable<any> {
    return this.apiCall.request('POST', locationController.country.edit, country);
  }

  deleteCountry(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', locationController.country.delete(id, companyId), {});
  }

  // City methods
  getCities(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', locationController.city.get, request);
  }

  addCity(city: any): Observable<any> {
    return this.apiCall.request('POST', locationController.city.add, city);
  }

  editCity(city: any): Observable<any> {
    return this.apiCall.request('POST', locationController.city.edit, city);
  }

  deleteCity(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', locationController.city.delete(id, companyId), {});
  }

  // Zone methods
  getZones(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', locationController.zone.get, request);
  }

  addZone(zone: any): Observable<any> {
    return this.apiCall.request('POST', locationController.zone.add, zone);
  }

  editZone(zone: any): Observable<any> {
    return this.apiCall.request('POST', locationController.zone.edit, zone);
  }

  deleteZone(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', locationController.zone.delete(id, companyId), {});
  }
}
