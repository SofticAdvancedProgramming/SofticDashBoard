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
   }
  assignTask(request: any): Observable<any> {
    return this.http.request('POST', TasksBaseController.AssignTask, request);
  }
  reAssignTask(request: any): Observable<any> {
    return this.http.request('POST', taskController.ReAssignTask, request);
  }
  assignEmployees(request: any): Observable<any> {
    return this.http.request('POST', taskController.GetAssignmentEmployees, request);
  }

  assignCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TasksBaseController.AssignCost, request);
  }

  AssignEvaluation(request:any) :Observable<any>
  {
    return this.http.request('POST', taskController.AssignEvaluation, request);
  }

  getCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TasksBaseController.GetCost, request);
  }

  assignEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.AssignEvaluation, request);
   }

  getEvaluation(id:number,request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.GetEvaluation(id), request);
  }

  get(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksBaseController.Delete(id, companyId), {});
  }
  deleteTodo(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksBaseController.DeleteTodo(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksBaseController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksBaseController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.Count, request);
   }
}
