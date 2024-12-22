import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { employeeTypeController } from '../../apis/employeeTypeController';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {

  constructor(private apiCall:ApiCall) { }

  getEmployeeType(request: any): Observable<any> {
      return this.apiCall.request('POST', employeeTypeController.GET, request);
    }
}
