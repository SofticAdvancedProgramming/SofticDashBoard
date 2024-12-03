import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { assetsController } from '../../apis/assertsController';
import { Assets } from '../../../models/assetsModel';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private apiCall: ApiCall) { }

  getMainAssets():Observable<any>{
    return this.apiCall.request("POST", assetsController.getMainAssets, {pageSize:50})
  }

  addAsset(assets: Assets):Observable<any>{
    return this.apiCall.request("POST", assetsController.addAsset, assets)
  }
}
