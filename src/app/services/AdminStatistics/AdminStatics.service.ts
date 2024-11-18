import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { adminStaticsController } from '../../apis/AdminStaticsController';

@Injectable({
  providedIn: 'root'
})
export class AdminStaticsService {

  constructor(private apiCall: ApiCall) { }
  private apiUrl = environment.apiBaseUrl;

  AdminCounts(): Observable<any> {
    return this.apiCall.request('POST', `${adminStaticsController.adminCounts}`, {});
  }

  superadminCounts(request: any): Observable<any> {
    return this.apiCall.request('POST', `${adminStaticsController.superadminCounts}`, request);
  }

  employeeDepartmentcounts(request: any): Observable<any> {
    return this.apiCall.request('POST', `${adminStaticsController.employeeDepartmentcounts}`, request);
  }
  assetCategorycounts(request: any): Observable<any> {
    return this.apiCall.request('POST', `${adminStaticsController.assetCategorycounts}`, request);
  }
  
}
