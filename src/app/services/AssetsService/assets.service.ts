import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { assetsCategoryController, assetsController } from '../../apis/assertsController';
import { Assets } from '../../../models/assetsModel';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private apiCall: ApiCall) { }

  getMainAssetsCategory(request: any = {}):Observable<any>{
    return this.apiCall.request("POST", assetsCategoryController.getMainAssets, request)
  }

  addAssetCategory(assets: Assets):Observable<any>{
    return this.apiCall.request("POST", assetsCategoryController.addAsset, assets)
  }
  editAssetCategory(AssetCategory: any): Observable<any> {
    return this.apiCall.request('POST', assetsCategoryController.editAsset, AssetCategory);
  }

  deleteAssetCategory(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${assetsCategoryController.deleteAsset}/${id}/${companyId}`, {});
  }

  addAsset(request: any):Observable<any>{
    return this.apiCall.request("POST", assetsController.addAsset, request)
  }
}
