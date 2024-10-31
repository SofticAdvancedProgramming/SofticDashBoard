import { environment } from "../environment/environment";

 
export const branchController = {
  getBranch: `${environment.apiBaseUrl}Branch/Get`,
  addBranch: `${environment.apiBaseUrl}Branch/Add`,
  editBranch: `${environment.apiBaseUrl}Branch/Edit`,
  deleteBranch: (id: number, companyId: number) => `${environment.apiBaseUrl}Branch/Delete/${id}/${companyId}`,
  activateBranch: (id: number, companyId: number) => `${environment.apiBaseUrl}Branch/Activate/${id}/${companyId}`,
  deactivateBranch: (id: number, companyId: number) => `${environment.apiBaseUrl}Branch/DeActivate/${id}/${companyId}`,
};
