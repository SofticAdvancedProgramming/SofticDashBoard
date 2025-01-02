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
    assetStatusName?:string;
    assetStatusNameAr?:string;
    assginDate?:Date|null;
    parentAssetName?:string;
    parentAssetNameAr?:string;
    serialNumber?:string;
    plateNumber?:string;
    reason?:string;


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
