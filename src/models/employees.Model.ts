import { EmployeeReference } from "./employeeRef.model";

export interface Employee {
  id: number;
  employeeId?:number
  firstName: string;
  referancePhoto?: string;
  phoneNumber: string;
  lastName: string;
  fullName: string;
  email: string;
  gender: number;
  accountStatus: number;
  birthDate: string;
  nationality: string;
  maritalStatus: string;
  nationalId: string;
  passport: string;
  drivingLicense: string | null;
  salary: number;
  netSalary: number;
  facebook: string | null;
  linkedIn: string | null;
  twitterX: string | null;
  instgram: string | null;
  snapShot: string | null;
  systemRank: string | null;
  officeRank: string | null;
  healthCardNo: string | null;
  isEmployeeAddresseAdded: boolean;
  isPersonalInformationAdded: boolean;
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
  positionId: number | null;
  position: string | null;
  departmentId: number | null;
  department: string | null;
  branchId: number | null;
  branch: string | null;
}

export interface EmployeeAddress {
  fullAddress: string;
  nearBy: string;
  street: string;
  floor: number;
  unit: string;
  buildingNo: string;
  isOrginalAddress: boolean;
  employeeId: number;
  cityId: number;
  countryId: number;
  zoneId: number;
  id?: number;
}
export interface FileDescription {
  id:number;
  description:string;
  descriptionAr:string;
  fileDescriptionTypeId:number;

}
export interface EmployeeEducational {
  name: string;
  nameAr: string;
  educationalStart: string;
  educationalEnd: string;
  school: string;
  specialist: string;
  specialistAr: string;
  degree: string;
  description: string;
  descriptionAr: string;
  employeeId: number;
  file?: string;
  fileExtension?: string;
  fileDescriptionId:string;
  id?:number;
  fileDescription?:FileDescription

}

export interface EmployeeEmail {
  email: string;
  isFavorite: boolean;
  isWork: boolean;
  employeeId: number;
  id?:number
}

export interface EmployeeSkill {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  skillTypeId: number;
  employeeId: number;
  id?:number;
}


export interface EmployeeCertificate {
  name: string;
  nameAr: string;
  certificateTypeId: number;
  employeeId: number;
  file?: string;
  fileExtension?: string;
  id?:number;
  fileDescriptionId?:number;
  from:Date;
  to:Date;
  issuer:string;
  specialist:string;
  fileDescription?:FileDescription

}
export interface EmployeeCertificateTypes {
  name: string;
  nameAr: string;
  id?: number;
}
export interface EmployeeUnivercity {
  name: string;
  nameAr: string;
  id?: number;
}
export interface EmployeeSkillType {
  name: string;
  nameAr: string;
  id?: number;
}
export interface InsuranceCompany {
  name: string;
  nameAr: string;
  id?: number;
}

export interface EmployeeLanguage {
  languageId: number;
  employeeId: number;
}

export interface EmployeeMedicalInfo {
  medicalInsuranceNumber?: string;
  insuranceCompany?: string;
  expiryon?: string;
  bloodType: string;
  healthCondition?: string;
  allergy?: string;
  hight: number;
  weight: number;
  ischronicdisease?: boolean;
  chronicdiseaseName?: string;
  employeeId?: number;
  id?:number;
}

export interface WorkExperience {
  companyName: string;
  businessTypeId: number;
  businessSizeId: number;
  jobDescription?: string;
  jobTitle: string;
  startFrom: string | Date;
  endAt?: string | Date;
  isCurrent: boolean;
  firstReferenceName: string;
  secondReferencTelephone?: string;
  secondReferenceName?: string;
  fileDescriptionId: number;
  firstReferencTelephone: string;
  employeeId: number;
  file?: string;
  fileExtension?: string;
  firstReferencJob:string;
  secondReferencJob?:string;
  id?:number
}

export interface BusinessType extends GenericFields {
  id: number;
  name: string;
  nameAr: string;
}

export interface BusinessSize extends GenericFields {
  id: number;
  name: string;
  nameAr: string;
}

export interface LifeStyle extends GenericFields {
  id: number;
  lifeTypeID: number;
  lifeStyleType?: LifeStyleType;
  objectID: number;
  employee?: Employee;
  customer?: Customer;
}

interface Customer {
  id: number;
  name: string;
}

export interface LifeStyleType extends GenericFields {
  id?: number;
  nameE: string;
  nameA: string;
}
interface GenericFields {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface EmployeeCommunication {
  employeeId?: number;
  facebook?: string;
  linkedIn?: string;
  twitterX?: string;
  instgram?: string;
  snapShot?: string;
  employeeEmails: EmployeeEmail[];
  employeeTelephones: EmployeeTelephone[];
  employeeRefernces:EmployeeReference[]
  employeeRefernceId?:string;
}

export interface EmployeeEmail {
  email: string;
  isFavorite: boolean;
  isWork: boolean;
  employeeId: number;
}

export interface EmployeeTelephone {
  isMobile: boolean;
  isFavourit: boolean;
  isWhatsApp?: boolean;
  phoneNumber: string;
  employeeId: number;
  id?:number
}
export interface Department {
  id: number;
  name: string;
  nameAr: string;
}
export interface DocumentType {
  id: number;
  name: string;
  nameAr: string;
}
export interface FileDescriptionType {
  id?: number;
  name: string;
  nameAr: string;
}
export interface EmployeeAttachmentType {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  id?:number
}
export interface EmployeeFileDescription {
  description: string;
  descriptionAr: string;
  fileDescriptionTypeId: string;
}
export interface EmployeeAttachment{
  name: string;
  fileDescriptionId:number;
  file:string;
  fileExtension:string;
  attachmentCategoryId:number;
  id?:number;
  employeeId:number;
}
export enum AccountStatus {
  Accepted = 1,
  Pending = 2,
  Rejected = 3
}
