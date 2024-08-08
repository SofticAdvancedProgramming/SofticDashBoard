import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../../core/services/http-service/HttpService';
@Injectable({
  providedIn: 'root'
})
export class PositionTypeService {
  private positionTypeUrl = `${environment.apiBaseUrl}PositionType`;

  constructor(private apiCall: ApiCall) { }

  getPositionTypes(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.positionTypeUrl}/Get`, request);
  }

  addPositionType(PositionType: any): Observable<any> {
    return this.apiCall.request('POST', `${this.positionTypeUrl}/Add`, PositionType);
  }

  editPositionType(PositionType: any): Observable<any> {
    return this.apiCall.request('POST', `${this.positionTypeUrl}/Edit`, PositionType);
  }

  deletePositionType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.positionTypeUrl}/Delete/${id}/${companyId}`, {});
  }
}
