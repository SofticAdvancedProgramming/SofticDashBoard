import { environment } from "../environment/environment";


export const requestTypeController = {
    Add: `${environment.apiBaseUrl}RequestType/Add`,
    Get: `${environment.apiBaseUrl}RequestType/Get`,
    Edit: `${environment.apiBaseUrl}RequestType/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}RequestType/Delete/${id}/${companyId}`,
}