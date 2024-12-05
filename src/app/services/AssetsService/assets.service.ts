import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { assetsCategoryController, assetsController, relatedAssetsController } from '../../apis/assertsController';
import { Assets } from '../../../models/assetsModel';
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private apiCall: ApiCall) { }

  getMainAssetsCategory(request: any = {}): Observable<any> {
    return this.apiCall.request("POST", assetsCategoryController.getMainAssets, request)
  }

  getAsset(request: any = {}): Observable<any> {
    return this.apiCall.request("POST", assetsCategoryController.getAsset, request)
  }
  addAssetCategory(assets: Assets): Observable<any> {
    return this.apiCall.request("POST", assetsCategoryController.addAsset, assets)
  }
  editAssetCategory(AssetCategory: any): Observable<any> {
    return this.apiCall.request('POST', assetsCategoryController.editAsset, AssetCategory);
  }

  deleteAssetCategory(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${assetsCategoryController.deleteAsset}/${id}/${companyId}`, {});
  }

  addAsset(request: any): Observable<any> {
    return this.apiCall.request("POST", assetsController.addAsset, request)
  }
  receivedAsset(assetId: number, employeeId: number, request: any): Observable<any> {
    const url = assetsController.receivedAsset(assetId, employeeId);
    return this.apiCall.request("POST", url, request);
  }

  getRelatedAssets(request: any = {}): Observable<any> {
    return this.apiCall.request("POST", relatedAssetsController.getRelatedAssets, request)
  }
  addRelatedAssets(request: any = {}): Observable<any> {
    return this.apiCall.request("POST", relatedAssetsController.addRelatedAssets, request)
  }
  editRelatedAssets(request: any): Observable<any> {
    return this.apiCall.request('POST', relatedAssetsController.editRelatedAssets, request);
  }
  deleteRelatedAssets(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${relatedAssetsController.deleteRelatedAssets}/${id}/${companyId}`, {});
  }
}
