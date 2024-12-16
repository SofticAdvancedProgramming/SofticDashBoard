import { TasksController } from './../../apis/tasksController';
import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { TasksBaseController } from '../../apis/TasksBaseController';
import { taskController } from '../../apis/taskController';
 

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: ApiCall) { }

  assignTaskStatus(request: any): Observable<any> {
    return this.http.request('POST', TasksBaseController.AssignTaskStatus, request);
    return this.http.request('POST', taskController.AssignTaskStatus, request);
  }
  assignTask(request: any): Observable<any> {
    return this.http.request('POST', taskBaseController.AssignTask, request);
  }
  assignEmployees(request: any): Observable<any> {
    return this.http.request('POST', taskController.GetAssignmentEmployees, request);
  }

  assignCost(request:any) :Observable<any>
  {
    return this.http.request('POST', taskBaseController.AssignCost, request);
  }

  getCost(request:any) :Observable<any>
  {
    return this.http.request('POST', taskBaseController.GetCost, request);
  }

  assignEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.AssignEvaluation, request);
    return this.http.request('POST', taskController.AssignEvaluation, request);
  }

  getEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', taskBaseController.GetEvaluation, request);
  }

  get(request:any):Observable<any>
  {
    return this.http.request('POST', taskBaseController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', taskBaseController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', taskBaseController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', taskBaseController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', taskBaseController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', taskBaseController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.Count, request);
    return this.http.request('POST', taskController.Count, request);
  }
}
