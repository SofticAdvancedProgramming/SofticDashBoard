import { environment } from "../environment/environment";


export const assetsCategoryController = {
    getAsset:`${environment.apiBaseUrl}Asset/Get`,
    getMainAssets: `${environment.apiBaseUrl}AssetCategory/Get`,
    addAsset: `${environment.apiBaseUrl}AssetCategory/Add`,
    editAsset: `${environment.apiBaseUrl}AssetCategory/Edit`,
    deleteAsset: `${environment.apiBaseUrl}AssetCategory/Delete`
};

export const assetsController = {
    addAsset: `${environment.apiBaseUrl}Asset/Add`,
    getAsset:`${environment.apiBaseUrl}Asset/Get`,
}
