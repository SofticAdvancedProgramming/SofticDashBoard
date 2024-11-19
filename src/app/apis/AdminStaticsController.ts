
import { environment } from "../environment/environment";

export const adminStaticsController = {
  adminCounts:  `${environment.apiBaseUrl}AdminStatics/admin/counts`,
  superadminCounts:  `${environment.apiBaseUrl}superadmin/counts`,
  employeeDepartmentcounts:  `${environment.apiBaseUrl}AdminStatics/EmployeeDepartmentcounts`,
  assetCategorycounts:`${environment.apiBaseUrl}AdminStatics/AssetCategorycounts`

};
