import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class PositionTypeService {
  private positionTypeUrl = `${environment.apiBaseUrl}PositionType`;

  constructor(private apiCall: ApiCall) {}

  getPositionTypes(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.positionTypeUrl}/Get`, 'get', request, headers);
  }

  addPositionType(PositionType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.positionTypeUrl}/Add`, 'post', PositionType, headers);
  }

  editPositionType(PositionType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.positionTypeUrl}/Edit`, 'put', PositionType, headers);
  }

  deletePositionType(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.positionTypeUrl}/Delete/${id}/${companyId}`, 'delete', {}, headers);
  }
}
