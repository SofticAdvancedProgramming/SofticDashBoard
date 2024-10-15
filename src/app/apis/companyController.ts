import { environment } from "../environment/environment";

 
export const companyController = {
  loadCompanies: `${environment.apiBaseUrl}Company/Get`,
  getCompany: `${environment.apiBaseUrl}Company/Get`,
  addCompany: `${environment.apiBaseUrl}Company/Add`,
  editCompany: `${environment.apiBaseUrl}Company/Edit`,
  activateCompany: `${environment.apiBaseUrl}Company/Activate`,
  deactivateCompany: `${environment.apiBaseUrl}Company/DeActivate`,
  activatePosition: (id: number, companyId: number) => `${environment.apiBaseUrl}Company/Activate/${id}/${companyId}`,
  deactivatePosition: (id: number, companyId: number) => `${environment.apiBaseUrl}Company/DeActivate/${id}/${companyId}`,
};
