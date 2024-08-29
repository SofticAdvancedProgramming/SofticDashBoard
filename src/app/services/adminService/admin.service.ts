import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiCall: ApiCall) { }
  private apiUrl = `${environment.apiBaseUrl}Admin`;

  AddAdmin(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Add', request);
  }
  EditStatus(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/EditAccountStatus', request);
  }
}
