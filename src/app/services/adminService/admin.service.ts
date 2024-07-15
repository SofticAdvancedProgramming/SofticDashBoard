import { Injectable } from '@angular/core';
import { ApiCall } from '../apiCall/apicall.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiCall: ApiCall) {}
  private apiUrl = `${environment.apiBaseUrl}Admin`;

  AddAdmin(request:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl+'/Add', 'post',request, headers);
  }
}
