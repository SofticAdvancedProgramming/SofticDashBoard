import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userSkillsController } from '../../apis/userSkillsController';

@Injectable({
  providedIn: 'root'
})
export class UserSkillsService {

  constructor(private apiCall:ApiCall) { }

  getSkills(request: any): Observable<any> {
    return this.apiCall.request('POST', userSkillsController.loadASkills, request);
  }
}
