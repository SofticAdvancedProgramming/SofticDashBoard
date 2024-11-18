import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { userAddressController } from '../../apis/userAddressController';
import { countryController } from '../../apis/countryController';
import { cityController } from '../../apis/cityController';

@Injectable({
  providedIn: 'root',
})
export class UserAddressService {
  constructor(private apiCall: ApiCall) {}

  getAddress(request: any): Observable<any> {
    return this.apiCall.request('POST', userAddressController.loadAddresses, request);
  }

  getCountry(request:any):Observable<any>{
    return this.apiCall.request('POST', countryController.loadCountry, request)
  }
  getCity(request:any):Observable<any>{
    return this.apiCall.request('POST', cityController.loadCity, request)
  }
}
