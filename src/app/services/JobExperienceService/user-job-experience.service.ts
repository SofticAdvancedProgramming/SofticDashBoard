import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userJobExperienceController } from '../../apis/userJobExperienceController';

@Injectable({
  providedIn: 'root'
})
export class UserJobExperienceService {

  constructor(private apiCall:ApiCall) { }

  getJobExperience(request: any): Observable<any> {
    return this.apiCall.request('POST', userJobExperienceController.EmployeeWorkHistory, request);
  }
}
