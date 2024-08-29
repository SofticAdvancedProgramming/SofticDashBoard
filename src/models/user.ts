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
