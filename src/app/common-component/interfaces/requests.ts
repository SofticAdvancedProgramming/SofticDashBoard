import { string } from '@tensorflow/tfjs-core';
export interface RequestAttachment {
  id: number;
  companyId: number;
  file: string;
  fileExtension: string;
  requestId?: number;
}

export interface Request {
  id: number;
  companyId: number;
  employeeId: number;
  requestTypeId: number;
  requestStatusId: number;
  startDate: string;
  endDate: string;
  reason: string;
  isDelete?: boolean;
  requestAttachments: RequestAttachment[];
  employee?: Employee;
  pageIndex?: number;
  pageSize?: number;
}
export enum RequestStatus {
  ALL=-1,
  Accepted = 1,
  Pending = 2,
  Rejected = 3
}
export interface RequestAction {
  id: number;
  requestStatusId: number;
}
export interface Employee {
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle: string  ;
  profileImage: string ;
  createdOn: string;}


//Reciver Requests


export interface ReciverRequestSC {
  id: number;
  requestId: number;
  receiverId: number;
  requestStatusId: number;
  isDelete?: boolean;
  companyId: number;
  pageIndex?: number;
  pageSize?: number;
  employeeId?:number;
  startDate:string;
  endDate:string;
  createdOnTo:string;
  createdOnFrom:string;
}


export interface Receiver {
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle: string;
  profileImage: string | null;
}

export interface ReciverRequestStatus {
  name: string;
  nameAr: string;
  id: number;
  companyId: number;
}

export interface ReceivedRequest {
  requestId: number;
  request: Request;
  receiverId: number;
  receiver: Receiver;
  requestStatusId: number;
  requestStatus: ReciverRequestStatus;
  id: number;
  requestTypeId:number;
  companyId: number;
  employee?: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    jobTitle?: string;
  };
  createdOn?: string;

}
export interface AddRequest {
  id: number;
  companyId: number;
  employeeId: number;
  requestTypeId: number;
  requestStatusId: number;
  startDate: string; 
  endDate: string;  
  amount?: number;
  assetCategoryId?: number;
  reason: string;
  requestAttachments: RequestAttachment[];
}