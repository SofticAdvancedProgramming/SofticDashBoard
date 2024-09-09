import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Department } from '../../../../models/department';
import { ApiCall } from '../../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private departmentUrl = `${environment.apiBaseUrl}Department`;

  constructor(private apiCall: ApiCall) { }

  getDepartment(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.departmentUrl}/Get`, request);
  }

  addDepartment(department: Department): Observable<any> {
    return this.apiCall.request('POST', `${this.departmentUrl}/Add`, department);
  }

  editDepartment(department: Department): Observable<any> {
    return this.apiCall.request('POST', `${this.departmentUrl}/Edit`, department);
  }

  deleteDepartment(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.departmentUrl}/Delete/${id}/${companyId}`, {});
  }
  Activatedepartment(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.departmentUrl}/Activate/${id}/${companyId}`, {});
  }
  DeActivatedepartment(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.departmentUrl}/DeActivate/${id}/${companyId}`, {});
  }
}
