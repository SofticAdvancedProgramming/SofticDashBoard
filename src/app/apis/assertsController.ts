import { environment } from "../environment/environment";


export const assetsController = {
    getAsset:`${environment.apiBaseUrl}Asset/Get`,
    getMainAssets: `${environment.apiBaseUrl}AssetCategory/Get`,
    addAsset: `${environment.apiBaseUrl}AssetCategory/Add`,
    editAsset: `${environment.apiBaseUrl}AssetCategory/Edit`,
    deleteAsset: `${environment.apiBaseUrl}AssetCategory/Delete`,
    AssetAssignmentCounts:`${environment.apiBaseUrl}AdminStatics/AssetAssignmentCounts`,
    AssetCategorycounts:`${environment.apiBaseUrl}AdminStatics/AssetCategorycounts`

};
