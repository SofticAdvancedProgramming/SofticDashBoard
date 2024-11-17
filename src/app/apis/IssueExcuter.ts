import { environment } from "../environment/environment";

export const IssueExcuter = {
    Get: `${environment.apiBaseUrl}IssueExcuter/Get`,
    Add: `${environment.apiBaseUrl}IssueExcuter/Add`,
    Edit: `${environment.apiBaseUrl}IssueExcuter/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueExcuter/Delete/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueExcuter/Activate/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueExcuter/DeActivate/${id}/${companyId}`,
    Action: (id: number, issueStatusId: number) => `${environment.apiBaseUrl}IssueExcuter/${id}/Action/${issueStatusId}`,
    Count: `${environment.apiBaseUrl}IssueExcuter/Count`
};
