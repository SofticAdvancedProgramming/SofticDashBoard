import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../../../../models/department'; // Ensure this is correctly imported
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { departmentController } from '../../../apis/departmentController';
import { DepartmentSC } from '../../../core/models/Lookup/Department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private apiCall: ApiCall) { }

  getDepartment(request: DepartmentSC = {}): Observable<any> {
    return this.apiCall.request('POST', departmentController.getDepartment, request);
  }

  addDepartment(department: Department): Observable<any> {
    return this.apiCall.request('POST', departmentController.addDepartment, department);
  }

  editDepartment(department: Department): Observable<any> {
    return this.apiCall.request('POST', departmentController.editDepartment, department);
  }

  deleteDepartment(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', departmentController.deleteDepartment(id, companyId), {});
  }

  activateDepartment(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', departmentController.activateDepartment(id, companyId), {});
  }

  deactivateDepartment(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', departmentController.deactivateDepartment(id, companyId), {});
  }
}



