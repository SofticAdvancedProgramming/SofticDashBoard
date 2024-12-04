import { environment } from "../environment/environment";


export const assetsCategoryController = {
    getMainAssets: `${environment.apiBaseUrl}AssetCategory/Get`,
    addAsset: `${environment.apiBaseUrl}AssetCategory/Add`,
    editAsset: `${environment.apiBaseUrl}AssetCategory/Edit`,
    deleteAsset: `${environment.apiBaseUrl}AssetCategory/Delete`
};

export const assetsController = {
    addAsset: `${environment.apiBaseUrl}Asset/Add`
}
