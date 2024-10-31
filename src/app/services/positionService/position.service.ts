import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from '../../../models/positionModel';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { positionController } from '../../apis/positionController';
 
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private apiCall: ApiCall) { }

  getPosition(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', positionController.getPosition, request);
  }

  addPosition(position: Position): Observable<any> {  
    return this.apiCall.request('POST', positionController.addPosition, position);
  }

  editPosition(position: any): Observable<any> {
    return this.apiCall.request('POST', positionController.editPosition, position);
  }

  deletePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', positionController.deletePosition(id, companyId));
  }

  activatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', positionController.activatePosition(id, companyId), {});
  }

  deactivatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', positionController.deactivatePosition(id, companyId), {});
  }
}
