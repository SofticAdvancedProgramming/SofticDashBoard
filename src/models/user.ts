 export interface user {
  fullName: string,
  phoneNumber: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userType: number
  companyExtention:string
}
export interface LifeStyle{
  id:Number;
  companyId:Number;
  name: string;
  nameAr :  string ;
}
export interface reference{
  id:Number;
  companyId:Number;
  name: string;
  nameAr :  string ;
}

export interface PersonalInformation {
  phoneNumber: string;
  email: string;
  id: number;
  referancePhoto: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: number;  
  birthDate: string;  
  nationality: string | null;
  maritalStatus: string | null;
  nationalId: string | null;
  nationalIdPhoto: string;
  nationalPhotoExtension: string | null;
  passport: string | null;
  passportPhoto: string;
  passportPhotoExtension: string | null;
  profileImage: string;
  profileImageExtension: string | null;
}
export interface Address {
  id: number;
  fullAddress: string;
  nearBy: string;
  street: string;
  floor: number;
  unit: string;
  buildingNo: string;
  isOrginalAddress: boolean;
  countryId: number;
  cityId: number;
  zoneId: number;
  userId: number;
}

 
export interface SocialInfo {
  id: number;
  facebook: string;
  linkedIn: string;
  twitterX: string;
  instgram: string;
  snapShot: string;
  userEmails: {
    id: number;
    email: string;
    isFavorite: boolean;
    isWork: boolean;
    userId: number;
  }[];
  userTelephones: {
    isMobile: boolean;
    isFavourit: boolean;
    isWhatsApp: boolean;
    telephone: string;
    userId: number;
    id: number;
    companyId: number;
  }[];
  userRefernces: {
    name: string;
    rRelationShipID: number;
    telephone: string;
    fullAddress: string;
    nearBy: string;
    street: string;
    floor: number;
    unit: string;
    buildingNo: string;
    isEmployee: boolean;
    userRefernceId: number | null;
    userId: number;
    refernceTypeId: number;
    id: number;
    companyId: number;
  }[];
}
