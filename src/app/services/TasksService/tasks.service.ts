import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { Task } from '../../core-component/dashboard/models/Task';
import { taskController } from '../../apis/taskController';
 

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: ApiCall) { }

  assignTaskStatus(request: any): Observable<any> {
    return this.http.request('POST', taskController.AssignTaskStatus, request);
  }
  assignTask(request: any): Observable<any> {
    return this.http.request('POST', taskController.AssignTask, request);
  }
  assignEmployees(request: any): Observable<any> {
    return this.http.request('POST', taskController.GetAssignmentEmployees, request);
  }

  assignCost(request:any) :Observable<any>
  {
    return this.http.request('POST', taskController.AssignCost, request);
  }

  getCost(request:any) :Observable<any>
  {
    return this.http.request('POST', taskController.GetCost, request);
  }

  assignEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', taskController.AssignEvaluation, request);
  }

  getEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', taskController.GetEvaluation, request);
  }

  get(request:any):Observable<any>
  {
    return this.http.request('POST', taskController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', taskController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', taskController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', taskController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', taskController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', taskController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', taskController.Count, request);
  }
}
