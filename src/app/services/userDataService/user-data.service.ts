import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private PersonalInformationUrl = `${environment.apiBaseUrl}Users`;

  constructor(private apiCall: ApiCall) { }
  loadPersonalInformation(request: any): Observable<any> {
    return this.apiCall.request('POST', this.PersonalInformationUrl + '/GetPersonalInformation', request,);
  }
  editPersonalInformation(request: any): Observable<any> {
    return this.apiCall.request('POST', this.PersonalInformationUrl + '/EditPersonalInformation', request,);
  }
}
