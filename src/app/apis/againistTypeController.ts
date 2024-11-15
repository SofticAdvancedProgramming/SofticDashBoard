import { environment } from "../environment/environment";

 
export const AgainestTypeController = {
  Get: `${environment.apiBaseUrl}AgainestType/Get`,
  Add: `${environment.apiBaseUrl}AgainestType/Add`,
  Edit: `${environment.apiBaseUrl}AgainestType/Edit`,
  Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}AgainestType/Delete/${id}/${companyId}`
};
