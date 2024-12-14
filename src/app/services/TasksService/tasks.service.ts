 import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { TasksBaseController } from '../../apis/TasksBaseController';
 

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
 

  assignCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TasksBaseController.AssignCost, request);
  }

  getCost(request:any) :Observable<any>
  {
    return this.http.request('POST', TasksBaseController.GetCost, request);
  }

  assignEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.AssignEvaluation, request);
  }

  getEvaluation(request:any):Observable<any>
  {
    return this.http.request('POST', TasksBaseController.GetEvaluation, request);
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
