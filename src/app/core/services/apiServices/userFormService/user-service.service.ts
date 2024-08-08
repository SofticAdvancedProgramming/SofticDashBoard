import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';
import { HttpService } from '../../http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = `Company/Get`;
  constructor(private http: HttpService) { }

  loadCompanies(): Observable<any[]> {
    return this.http.SendRequest('POST', this.apiUrl, {});
  }
}


