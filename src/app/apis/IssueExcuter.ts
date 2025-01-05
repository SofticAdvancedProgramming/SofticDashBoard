import { environment } from "../environment/environment";

export const IssueExcuter = {
  GetIssueById:`${environment.apiBaseUrl}Issue/Get`,
    Get: `${environment.apiBaseUrl}IssueExcuter/Get`,
    Add: `${environment.apiBaseUrl}IssueExcuter/Add`,
    Edit: `${environment.apiBaseUrl}IssueExcuter/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueExcuter/Delete/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueExcuter/Activate/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueExcuter/DeActivate/${id}/${companyId}`,
    Action: (id: number, issueStatusId: number) => `${environment.apiBaseUrl}IssueExcuter/${id}/Action/${issueStatusId}`,
    Status:`${environment.apiBaseUrl}IssueStatus/Get`,
    Count: `${environment.apiBaseUrl}IssueExcuter/Count`
};

