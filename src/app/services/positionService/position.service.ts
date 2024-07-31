import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private PositionUrl = `${environment.apiBaseUrl}Position`;

  constructor(private apiCall: ApiCall) {}

  getDepartment(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Get`, 'post', request, headers);
  }

  addDepartment(position: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Add`, 'post', position, headers);
  }

  editDepartment(position: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Edit`, 'post', position, headers);
  }

  deleteDepartment(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}