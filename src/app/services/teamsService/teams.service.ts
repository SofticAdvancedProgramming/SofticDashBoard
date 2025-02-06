import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { teamsController } from '../../apis/team';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private http: ApiCall) { }
  addTeam(request: any): Observable<any> {
    return this.http.request('POST', teamsController.AddTeam, request);
  }
  editTeam(request: any): Observable<any> {
    return this.http.request('POST', teamsController.editTeam, request);
  }
  getTeam(request: any): Observable<any> {
    return this.http.request('POST', teamsController.getTeam, request);
  }
    delete(id: number, companyId: number): Observable<any> {
      return this.http.request('POST', teamsController.deleteTeam(id, companyId), {});
    }
}
