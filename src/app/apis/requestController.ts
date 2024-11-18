import { environment } from "../environment/environment";

export const requestController = {
    Get: `${environment.apiBaseUrl}Request/Get`,
    Add: `${environment.apiBaseUrl}Request/Add`,
    Edit: `${environment.apiBaseUrl}Request/Edit`,
    Action: `${environment.apiBaseUrl}Request/Action`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Request/Delete/${id}/${companyId}`,

    
    RequestType: {
        Get: `${environment.apiBaseUrl}RequestType/Get`,
        Add: `${environment.apiBaseUrl}RequestType/Add`,
        Edit: `${environment.apiBaseUrl}RequestType/Edit`,
        Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}RequestType/Delete/${id}/${companyId}`,
    },

    // RequestStatus-related routes
    RequestStatus: {
        Get: `${environment.apiBaseUrl}RequestStatus/Get`,
        Add: `${environment.apiBaseUrl}RequestStatus/Add`,
        Edit: `${environment.apiBaseUrl}RequestStatus/Edit`,
        Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}RequestStatus/Delete/${id}/${companyId}`,
    },
};
