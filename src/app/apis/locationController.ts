import { environment } from "../environment/environment";

 
export const locationController = {
  country: {
    get: `${environment.apiBaseUrl}Country/Get`,
    add: `${environment.apiBaseUrl}Country/Add`,
    edit: `${environment.apiBaseUrl}Country/Edit`,
    delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Country/Delete/${id}/${companyId}`,
  },
  city: {
    get: `${environment.apiBaseUrl}City/Get`,
    add: `${environment.apiBaseUrl}City/Add`,
    edit: `${environment.apiBaseUrl}City/Edit`,
    delete: (id: number, companyId: number) => `${environment.apiBaseUrl}City/Delete/${id}/${companyId}`,
  },
  zone: {
    get: `${environment.apiBaseUrl}Zone/Get`,
    add: `${environment.apiBaseUrl}Zone/Add`,
    edit: `${environment.apiBaseUrl}Zone/Edit`,
    delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Zone/Delete/${id}/${companyId}`,
  },
};
