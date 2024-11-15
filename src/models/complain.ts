import { IssueExcuter } from './../app/apis/IssueExcuter';
export interface Complaint {
    id: number;
    companyId: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    employeeId: number | null;
    againestName: string;
    againestTypeId: number;
    againestId: number | null;
    content: string;
    issueTypeId: number;
    issueStatusId: ComplaintStatus;
    createdOn: string;
    issueAttachments: Attachment[];
    issueExcuters: Excuter[];
 
  }
  
  export interface Attachment {
    id: number;
    companyId: number;
    issueId: number;
    file: string;
    fileExtension: string | null;
  }
  
  export interface Excuter {
    id: number;
    companyId: number;
    issueId: number;
    excuterId: number;
    issueStatusId: number | null;
    issue: Partial<Complaint>;  
  }
  
  export enum ComplaintStatus {
    PENDING = 2,
    REJECTED = 3,
    ACCEPTED = 1,
    REVIEW = 4,
  }
  
  export interface IssueExcuter {
    createdOn: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    employeeId: number | null;
    againestName: string;
    againestTypeId: number;
    againestId: number | null;
    content: string;
    issueTypeId: number;
    issueStatusId: number;
    issueAttachments: IssueAttachment[];
    issueExcuters: IssueExcuter[];
    id: number;
    companyId: number;
  }
  export interface IssueAttachment {
    issueId: number;
    file: string;
    fileExtension: string | null;
    id: number;
    companyId: number;
  }
  interface ListItem {
    IssueExcuter: IssueExcuter;
    issueId: number;
    excuterId: number;
    issueStatusId: number | null;
    id: number;
    companyId: number;
  }