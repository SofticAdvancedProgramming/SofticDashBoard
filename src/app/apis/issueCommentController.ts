import { environment } from "../environment/environment";

export const issueCommentController = {
    Get: `${environment.apiBaseUrl}IssueComment/Get`,
    Add: `${environment.apiBaseUrl}IssueComment/Add`,
    Edit: `${environment.apiBaseUrl}IssueComment/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}IssueComment/Delete/${id}/${companyId}`
};