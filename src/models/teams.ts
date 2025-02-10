export interface Team {
    id: number;
    companyId: number;
    name: string;
    nameAr: string;
    long: number;
    lat: number;
    associatedToTask: boolean;
    associatedToAttendance: boolean;
    expiryDate: string;
    employeeIds: number[];
  }
  export interface AddTeamRequest {
    id: number;
    companyId: number;
    name: string;
    nameAr: string;
    long: number;
    lat: number;
    associatedToTask: boolean;
    associatedToAttendance: boolean;
    expiryDate: string;
    employeeIds: number[];
  }
  