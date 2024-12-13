import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { TaskController } from '../../apis/tasksController';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private apiCall: ApiCall) {}

  addTask(request: any): Observable<any> {
    return this.apiCall.request('POST', TaskController.AddTask, request);
  }
}
