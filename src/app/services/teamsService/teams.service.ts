import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { teamsController } from '../../apis/team';
import { AddTeamRequest } from '../../../models/teams';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private http: ApiCall) { }
  addTeam(teamData: AddTeamRequest): Observable<any> {
    return this.http.request('POST', teamsController.AddTeam, teamData);
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
