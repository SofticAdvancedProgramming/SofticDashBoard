import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { Task } from '../../core-component/dashboard/models/Task';
import { TaskController } from '../../apis/TasksController';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: ApiCall) { }

  assignTaskStatus(request: any): Observable<any> {
    return this.http.request('POST', TaskController.AssignTaskStatus, request);
  }

  assignCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TaskController.AssignCost, request);
  }

  getCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TaskController.GetCost, request);
  }

  assignEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TaskController.AssignEvaluation, request);
  }

  getEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TaskController.GetEvaluation, request);
  }

  get(request:any):Observable<Task[]>
  {
    return this.http.request('POST', TaskController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', TaskController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', TaskController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TaskController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TaskController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TaskController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', TaskController.Count, request);
  }
}
