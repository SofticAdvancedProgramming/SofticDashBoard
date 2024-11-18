import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { requestController } from '../../apis/requestController';

@Injectable({
  providedIn: 'root'
})
export class RequestLockupService {

  constructor(private http: ApiCall) { }

  // RequestType methods
  getRequestTypes(request: any = {}): Observable<any> {
    return this.http.request('POST', requestController.RequestType.Get, request);
  }

  addRequestType(RequestType: any): Observable<any> {
    return this.http.request('POST', requestController.RequestType.Add, RequestType);
  }

  editRequestType(RequestType: any): Observable<any> {
    return this.http.request('POST', requestController.RequestType.Edit, RequestType);
  }

  deleteRequestType(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', requestController.RequestType.Delete(id, companyId), {});
  }

  // RequestStatus methods
  getRequestStatus(request: any = {}): Observable<any> {
    return this.http.request('POST', requestController.RequestStatus.Get, request);
  }

  addRequestStatus(RequestStatus: any): Observable<any> {
    return this.http.request('POST', requestController.RequestStatus.Add, RequestStatus);
  }

  editRequestStatus(RequestStatus: any): Observable<any> {
    return this.http.request('POST', requestController.RequestStatus.Edit, RequestStatus);
  }

  deleteRequestStatus(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', requestController.RequestStatus.Delete(id, companyId), {});
  }

}
