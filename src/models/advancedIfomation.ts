export interface Certificates {
  name: string;
  specialist: string;
  issuer: string;
  from: string;
  to: string;
}

export interface Address{
  countryId: number;
  cityId: number;
  street: string;
  buildingNo: string;
  fullAddress: string;
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
}

export interface WorkHistory{
  jobTitle: string;
  companyName: string;
  startFrom: string;
  endAt: string;
  jobDescription: string;
  firstReferencTelephone: string;
}

export interface Medical{
  bloodType: string;
  weight: string;
  hight: string;
  ischronicdisease: string;
}

export interface Social{
  facebook: string;
  instgram: string;
  linkedIn: string;
  snapShot: string;
  twitterX: string;
}

export interface Attachments{
  name: string;
  file: any;
}

export interface Skills{
  name: string;
  skillTypeName: string;
  description: string;
}
