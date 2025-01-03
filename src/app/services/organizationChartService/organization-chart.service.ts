import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { organizationChartController } from '../../apis/organizationChartController';

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {

  constructor(private apiCall: ApiCall) { }


  getAllOrganizationChart(params:{isDelete:boolean,companyId:number,pageSize:number})
  {
    return this.apiCall.request("POST", organizationChartController.get,params);
  }

}
