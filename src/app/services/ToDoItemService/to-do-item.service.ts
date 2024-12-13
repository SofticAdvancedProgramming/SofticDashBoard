import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { ToDoItemController } from '../../apis/ToDoItemController';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemService {

  constructor(private http: ApiCall) { }


  get(request:any):Observable<any>
  {
    return this.http.request('POST', ToDoItemController.Get, request);
  }

  add(request:any):Observable<any>
  {
    return this.http.request('POST', ToDoItemController.Add, request);
  }

  edit(request:any):Observable<any>
  {
    return this.http.request('POST', ToDoItemController.Edit, request);
  }

  delete(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', ToDoItemController.Delete(id, companyId), {});
  }

  activate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', ToDoItemController.Activate(id, companyId), {});
  }
  deActivate(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', ToDoItemController.DeActivate(id, companyId), {});
  }

  count(request:any):Observable<any>
  {
    return this.http.request('POST', ToDoItemController.Count, request);
  }
}
