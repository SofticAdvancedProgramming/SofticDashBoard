import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { adminController } from '../../apis/adminController';
 
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiCall: ApiCall) { }
  private apiUrl = environment.apiBaseUrl;

  AddAdmin(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}${adminController.Add}`, request);
  }

  EditStatus(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}${adminController.EditStatus}`, request);
  }
}
