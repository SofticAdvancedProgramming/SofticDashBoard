import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Position } from '../../../models/positionModel'; // Ensure this is correctly imported
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private PositionUrl = `${environment.apiBaseUrl}Position`;

  constructor(private apiCall: ApiCall) { }

  getPosition(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.PositionUrl}/Get`, request);
  }

  addPosition(position: Position): Observable<any> { // Use Position model here
    return this.apiCall.request('POST', `${this.PositionUrl}/Add`, position)
  }

  editPosition(position: any): Observable<any> {
    return this.apiCall.request('POST', `${this.PositionUrl}/Edit`, position);
  }

  deletePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.PositionUrl}/Delete/${id}/${companyId}`, 'post');
  }
  ActivatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.PositionUrl}/Activate/${id}/${companyId}`, {});
  }
  DeActivatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.PositionUrl}/DeActivate/${id}/${companyId}`, {});
  }
}
