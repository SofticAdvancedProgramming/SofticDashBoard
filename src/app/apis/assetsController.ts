import { environment } from "../environment/environment";


export const assetsCategoryController = {
    getAsset:`${environment.apiBaseUrl}Asset/Get`,
    getMainAssets: `${environment.apiBaseUrl}AssetCategory/Get`,
    addAsset: `${environment.apiBaseUrl}AssetCategory/Add`,
    editAsset: `${environment.apiBaseUrl}AssetCategory/Edit`,
    deleteAsset: `${environment.apiBaseUrl}AssetCategory/Delete`,


};

export const assetsController = {
    addAsset: `${environment.apiBaseUrl}Asset/Add`,
    getAsset:`${environment.apiBaseUrl}Asset/Get`,
    assignAsset: `${environment.apiBaseUrl}Asset/Assgin`,
    AssetAssignmentCounts:`${environment.apiBaseUrl}AdminStatics/AssetAssignmentCounts`,
    AssetCategorycounts:`${environment.apiBaseUrl}AdminStatics/AssetCategorycounts`,
    deleteAsset: `${environment.apiBaseUrl}Asset/Delete`,
    changrStatus:`${environment.apiBaseUrl}Asset/ChangeStatus`
}

export const relatedAssetsController = {
    getRelatedAssets:`${environment.apiBaseUrl}RelatedAsset/Get`,
    addRelatedAssets:`${environment.apiBaseUrl}RelatedAsset/Add`,
    editRelatedAssets:`${environment.apiBaseUrl}RelatedAsset/Edit`,
    deleteRelatedAssets: `${environment.apiBaseUrl}RelatedAsset/Delete`,

}
export const RelatedAssetsController = {
    addRelatedAsset: `${environment.apiBaseUrl}RelatedAsset/Add`,
    getRelatedAsset:`${environment.apiBaseUrl}RelatedAsset/Get`,

}
