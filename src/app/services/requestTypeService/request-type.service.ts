import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { branchController } from '../../apis/branchController';
import { departmentController } from '../../apis/departmentController';
import { positionController } from '../../apis/positionController';
import { requestCategoryController } from '../../apis/requestCategoryController';
import { requestTypeController } from '../../apis/requestTypeController';

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
  getRequestCategory(request: any): Observable<any> {
    return this.http.request('POST', requestCategoryController.Get, request);
  }
  addRequestType(request: any): Observable<any> {
    return this.http.request('POST', requestTypeController.Add, request);
  }
  getRequestType(request: any): Observable<any> {
    return this.http.request('POST', requestTypeController.Get, request);
  }
  deleteRequestType(id: number, companyId:number): Observable<any> {
    return this.http.request('POST', requestTypeController.Delete(id, companyId), {});
  }
  getRequestTypeById(id: number): Observable<any> {
    const payload = { id };  
    return this.http.request('POST', requestTypeController.Get, payload);  
  }
  
}
