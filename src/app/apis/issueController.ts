import { environment } from "../environment/environment";

export const issueController = {
    Get: `${environment.apiBaseUrl}Issue/Get`,
    Add: `${environment.apiBaseUrl}Issue/Add`,
    Edit: `${environment.apiBaseUrl}Issue/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Issue/Delete/${id}/${companyId}`
};