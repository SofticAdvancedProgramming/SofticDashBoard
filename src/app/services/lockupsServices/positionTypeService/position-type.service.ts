import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { positionTypeController } from '../../../apis/positionTypeController';
 
@Injectable({
  providedIn: 'root'
})
export class PositionTypeService {

  constructor(private apiCall: ApiCall) { }

  getPositionTypes(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', positionTypeController.getPositionTypes, request);
  }

  addPositionType(positionType: any): Observable<any> {
    return this.apiCall.request('POST', positionTypeController.addPositionType, positionType);
  }

  editPositionType(positionType: any): Observable<any> {
    return this.apiCall.request('POST', positionTypeController.editPositionType, positionType);
  }

  deletePositionType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', positionTypeController.deletePositionType(id, companyId), {});
  }
}
