import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { organizationChartController } from '../../apis/organizationChartController';

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {

  constructor(private apiCall: ApiCall) { }


  getAllOrganizationChart(params:{companyId:number})
  {
    return this.apiCall.request("POST", organizationChartController.get,params);
  }

}
