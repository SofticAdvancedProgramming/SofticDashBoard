import { environment } from "../environment/environment";


export const assetsController = {
    getMainAssets: `${environment.apiBaseUrl}AssetCategory/Get`,
    addAsset: `${environment.apiBaseUrl}AssetCategory/Add`
};
