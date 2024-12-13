import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { TasksController } from '../../apis/TasksController';
import { Task } from '../../core-component/dashboard/models/Task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: ApiCall) { }

  assignTaskStatus(request: any): Observable<any> {
    return this.http.request('POST', TasksController.AssignTaskStatus, request);
  }

  assignCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TasksController.AssignCost, request);
  }

  getCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TasksController.GetCost, request);
  }

  assignEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TasksController.AssignEvaluation, request);
  }

  getEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TasksController.GetEvaluation, request);
  }

  get(request:any):Observable<Task[]>
  {
    return this.http.request('POST', TasksController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', TasksController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', TasksController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TasksController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', TasksController.Count, request);
  }
}
