import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { TasksAssignmentController } from '../../apis/TaskAssignmentController';

@Injectable({
  providedIn: 'root'
})
export class TaskAssignmentService {

  constructor(private http: ApiCall) { }


  get(request:any):Observable<any>
  {
    return this.http.request('POST', TasksAssignmentController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', TasksAssignmentController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', TasksAssignmentController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksAssignmentController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksAssignmentController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksAssignmentController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', TasksAssignmentController.Count, request);
  }
}
