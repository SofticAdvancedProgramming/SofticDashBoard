export interface Attendances {
  id: number;
  day: string;
  attendanceDate: string;
  hour: string;
  long: number;
  lat: number;
  photo: string;
  signature: string;
  attendanceTypeId: number;
  employeeId: number;
}

export interface PaginatedAttendances {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  list: Attendances[];
}
