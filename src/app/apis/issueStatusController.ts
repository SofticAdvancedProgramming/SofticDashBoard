import { environment } from "../environment/environment";

export const IssueStatusController = {
    Get: `${environment.apiBaseUrl}IssueStatus/Get`,
    // Add: `${environment.apiBaseUrl}IssueStatus/Add`,
    // Edit: `${environment.apiBaseUrl}IssueStatus/Edit`,
    // Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueStatus/Delete/${id}/${companyId}`,
    // Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueStatus/Activate/${id}/${companyId}`,
    // DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueStatus/DeActivate/${id}/${companyId}`,
    // Action: (id: number, issueStatusId: number) => `${environment.apiBaseUrl}IssueStatus/${id}/Action/${issueStatusId}`,
    // Status:`${environment.apiBaseUrl}IssueStatus/Get`,
    // Count: `${environment.apiBaseUrl}IssueStatus/Count`
};
