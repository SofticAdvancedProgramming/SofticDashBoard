import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { TaskStatusController } from '../../apis/TaskStatusController';

@Injectable({
  providedIn: 'root'
})
export class TaskStatusService {

  constructor(private http: ApiCall) { }


  get(request:any):Observable<any>
  {
    return this.http.request('POST', TaskStatusController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', TaskStatusController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', TaskStatusController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TaskStatusController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TaskStatusController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', TaskStatusController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', TaskStatusController.Count, request);
  }
}
