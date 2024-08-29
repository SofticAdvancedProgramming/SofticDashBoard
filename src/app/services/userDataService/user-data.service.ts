import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private PersonalInformationUrl = `${environment.apiBaseUrl}Users`;
  private UserAddress = `${environment.apiBaseUrl}UserAddress`;
  private Country = `${environment.apiBaseUrl}Country`;
  private City = `${environment.apiBaseUrl}City`;
  private Zone = `${environment.apiBaseUrl}Zone`;

  constructor(private apiCall: ApiCall) { }
  loadPersonalInformation(request: any): Observable<any> {
    return this.apiCall.request('POST', this.PersonalInformationUrl + '/GetPersonalInformation', request,);
  }
  loadAddress(request: any): Observable<any> {
    return this.apiCall.request('POST', this.UserAddress + '/Get', request,);
  }
  loadCountries(request: any): Observable<any> {
    return this.apiCall.request('POST', this.Country + '/Get', request,);
  }
  loadCities(request: any): Observable<any> {
    return this.apiCall.request('POST', this.City + '/Get', request,);
  }
  loadZones(request: any): Observable<any> {
    return this.apiCall.request('POST', this.Zone + '/Get', request,);
  }
}
