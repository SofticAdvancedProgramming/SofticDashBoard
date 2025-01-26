import { Department } from "./department";
import { Position } from './postion';

export interface employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  referancePhoto: string;
  encodedData: string;
  accountStatus: number;
  gender: string | null;
  birthDate: Date | null;
  nationality: string | null;
  maritalStatus: string | null;
  nationalId: string | null;
  passport: string | null;
  drivingLicense: string | null;
  salary: number | null;
  netSalary: number | null;
  facebook: string | null;
  linkedIn: string | null;
  twitterX: string | null;
  instgram: string | null;
  snapShot: string | null;
  systemRank: string | null;
  officeRank: string | null;
  healthCardNo: string | null;
  isPersonalInformationAdded: boolean;
  isEmployeeAddresseAdded: boolean;
  isEmployeeAttachmentAdded: boolean;
  isEmployeeCertificateAdded: boolean;
  isEmployeeEducationalAdded: boolean;
  isEmployeeEmailAdded: boolean;
  isEmployeeHealthInformationAdded: boolean;
  isEmployeeIdentityDocumentAdded: boolean;
  isEmployeeLanguageAdded: boolean;
  isEmployeeLifeStyleAdded: boolean;
  isEmployeeSkillAdded: boolean;
  isEmployeeTelephoneAdded: boolean;
  isEmployeeWorkHistoryAdded: boolean;
  isEmployeeRefernceAdded: boolean;
  positionId: number | null;
  position: Position | null;
  departmentId: number | null;
  department: Department | null;
  branchId: number | null;
  branch: string | null;
  startShift?: { hour: number; minute: number } | null;
  endShift?: { hour: number; minute: number } | null;
  dateOfJoined: Date | null;
  hiringDate:Date | null;
  isActive:boolean
}

export class LeavesLog {
  holidayRequest: number;
  vacationBalance: number;

  constructor(holidayRequest: number = 0, vacationBalance: number = 0) {
    this.holidayRequest = holidayRequest;
    this.vacationBalance = vacationBalance;
  }
}
export interface FinancialLog {
  entitlements: number;
  deductions: number;
}

export interface FinancialLogResponse {
  status: number;
  message: string;
  data: FinancialLog;
  errors: any;
}

