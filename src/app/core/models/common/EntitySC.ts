export interface EntitySC {
  pageIndex?: number | null;
  pageSize?: number | null;
  sortIsAsc?: boolean | null;
  sortCol?: string | null;
  withDetails?: boolean | null;
  isDelete?: boolean | null;
  id?: number | null;
  companyId?: number | null;
}


export class DefaultEntitySC implements EntitySC {
  pageIndex = 1;
  pageSize = 100;
  sortIsAsc = true;
  sortCol = 'id';
  withDetails = false;
  isDelete = false;
  id = null;
  companyId = null;

}

export interface BaseModel {
  id?: number | null;
  companyId?: number | null;
}
