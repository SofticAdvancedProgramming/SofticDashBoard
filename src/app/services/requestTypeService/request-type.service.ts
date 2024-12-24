import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { branchController } from '../../apis/branchController';
import { departmentController } from '../../apis/departmentController';
import { positionController } from '../../apis/positionController';

@Injectable({
  providedIn: 'root'
})
export class RequestTypeService {

  constructor(private http:ApiCall) { }

  getBranches(request: any): Observable<any> {
    return this.http.request('POST', branchController.getBranch, request);
  }
  getDepartments(request: any): Observable<any> {
    return this.http.request('POST', departmentController.getDepartment, request);
  }
  getPositions(request: any): Observable<any> {
    return this.http.request('POST', positionController.getPosition, request);
  }
}
