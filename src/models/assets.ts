export interface Asset {
    id: number;
    companyId: number;
    name: string;
    nameAr: string;
    model: string;
    assetCategoryId: number;
    photo: string;
    photoExtension: string;
    long: string;
    lat: string;
    employeeId: number;
    assetCategoryName: string;
    assetCategoryNameAr:string;
    employeeName:string;
  }
  export interface RelatedAsset {
     companyId: number;
    name: string;
    nameAr: string;
    model: string;
    assetId: number;
    photo: any;
    photoExtension: any;
    parentAssetId:number

  }
