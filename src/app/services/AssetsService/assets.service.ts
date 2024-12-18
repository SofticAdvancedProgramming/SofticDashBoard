import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { map, Observable } from 'rxjs';
 import { Assets , assignAsset } from '../../../models/assetsModel';
import { request } from 'http';
import { RelatedAsset } from '../../../models/assets';
import { assetsCategoryController, assetsController, RelatedAssetsController } from '../../apis/assetsController';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(private apiCall: ApiCall) {}

  getMainAssetsCategory(request: any = {}): Observable<any> {
    return this.apiCall.request(
      'POST',
      assetsCategoryController.getMainAssets,
      request
    );
  }
  getAssetsCount(request: any): Observable<any> {
    //AssetAssignmentCounts
    return this.apiCall.request(
      'POST',
      assetsController.AssetAssignmentCounts,
      request
    );
  }
  AssetCategorycounts(request: any): Observable<any> {
    return this.apiCall.request(
      'POST',
      assetsController.AssetCategorycounts,
      request
    );
  }

  getAssetsAfterChange(request: any = {}): Observable<any> {
    return this.apiCall.request(
      'POST',
      assetsCategoryController.getAsset,
      request
    ).pipe(
      map((items)=>
        items.map((item:any)=>{
          item.parentAssetName='nnnnn';
          return item;
        })
      )
    )
    ;
  }
  getAsset(request: any = {}): Observable<any> {
    return this.apiCall.request(
      'POST',
      assetsCategoryController.getAsset,
      request
    );
  }
  addAssetCategory(assets: Assets): Observable<any> {
    return this.apiCall.request(
      'POST',
      assetsCategoryController.addAsset,
      assets
    );
  }
  editAssetCategory(AssetCategory: any): Observable<any> {
    return this.apiCall.request(
      'POST',
      assetsCategoryController.editAsset,
      AssetCategory
    );
  }

  deleteAssetCategory(id: number, companyId: number): Observable<any> {
    return this.apiCall.request(
      'POST',
      `${assetsCategoryController.deleteAsset}/${id}/${companyId}`,
      {}
    );
  }

  addAsset(request: any): Observable<any> {
    return this.apiCall.request('POST', assetsController.addAsset, request);
  }
  assignAsset(assignAsset: assignAsset): Observable<any> {
    return this.apiCall.request("POST", assetsController.assignAsset, assignAsset)
  }
  edit(Asset: any): Observable<any> {
    return this.apiCall.request("POST", assetsController.editAsset, Asset)
  }

  deleteAsset(id: number, companyId: number): Observable<any> {
    return this.apiCall.request(
      'POST',
      `${assetsController.deleteAsset}/${id}/${companyId}`,
      {}
    );
  }
  changrStatus(id: number,statusId:number): Observable<any>{
    return this.apiCall.request(
      'POST',
      `${assetsController.changrStatus}/${id}/${statusId}`,
      {}
    );
  }


  addRelatedAsset(request: RelatedAsset): Observable<any> {
    return this.apiCall.request("POST", RelatedAssetsController.addRelatedAsset, request);
  }
  getRelatedAssets(request: any) {
    return this.apiCall.request("POST", RelatedAssetsController.getRelatedAsset, request);
   }
}
