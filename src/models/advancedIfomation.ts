export interface Certificates {
  name: string;
  specialist: string;
  issuer: string;
  from: string;
  to: string;
  file:any;
  certificateLink:string;
  certificateNumber:string;
  fileDescription: {
    description: string;
  };
}

export interface Address{
  countryId: number;
  cityId: number;
  street: string;
  buildingNo: string;
  fullAddress: string;
  countryName:string;
  countryNameAr:string;
  cityName:string;
  cityNameAr:string;
  isOrginalAddress:boolean;
  nearBy:string;
  unit:string;
  floor:string;
  zoneId:number;
  zoneName:string;
  zoneNameAr:string;
}
export interface ContryName{
  name: string;
}

export interface CityName{
  name: string;
}

export interface Education{
  name: string;
  specialist: string;
  school: string;
  educationalEnd: string;
  degree: string;
  file:any;
  description: string;
  educationalStart: string;
}

export interface WorkHistory{
  jobTitle: string;
  companyName: string;
  startFrom: string;
  endAt: string;
  jobDescription: string;
  firstReferencTelephone: string;
  fileDescription:any;
  firstReferencJob: string;
  firstReferenceName: string;
  secondReferencJob:any;
  secondReferenceName: string;
  secondReferencTelephone: string;
  businessTypeId:number;
  businessSizeId:number;
  businessTypeName: string;
  businessSizeName: string;
  businessType:string;
  businessSize:string;
  file:any;

}

export interface Medical{
  bloodType: string;
  weight: string;
  hight: string;
  ischronicdisease: string;
  allergy?: string;
  chronicdiseaseName?:string;
  expiryon?:string;
  healthCondition?:string;
  insuranceCompany?:string;
  medicalInsuranceNumber?:string;
}

export interface Social{
  facebook: string;
  instgram: string;
  linkedIn: string;
  snapShot: string;
  twitterX: string;
  userEmails?:any[];
  userRefernces?:any[];
  userTelephones?:any[];

}

export interface Attachments{
  name: string;
  file: any;
  fileDescription: {
    description: string;
  };
}

export interface Skills{
  name: string;
  skillTypeName: string;
  description: string;
}
