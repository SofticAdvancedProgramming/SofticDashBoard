import { Component, OnInit } from '@angular/core';
 import { GlobalFunctionsService } from '../../../../services/Global Functions Dashboard/global-functions.service';
import { AttendanceService } from '../../../../services/AttendanceService/attendance.service';
import { PaginatedAttendances } from '../../../../../models/attendances';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { MapComponent } from "../../../../common-component/map/map.component";
import bootstrap, { Modal } from 'bootstrap'; 
@Component({
    selector: 'app-employee-attendance',
    standalone: true,
    templateUrl: './employee-attendance.component.html',
    styleUrls: ['./employee-attendance.component.css'],
    imports: [ModernTableComponent, MapComponent ]
})
export class EmployeeAttendanceComponent implements OnInit {
  public attendances: PaginatedAttendances = {
    pageIndex: 1,
    pageSize: 10,
    totalRows: 0,
    totalPages: 0,
    list: []
  };
  public selectedEmployee: any = null;

  constructor(
    private attendanceService: AttendanceService,
    private functionService: GlobalFunctionsService
  ) {}

  ngOnInit() {
    this.getAttendances();
  }

  getAttendances(pageIndex?: number) {
    const query = { pageIndex: pageIndex || 1, sortIsAsc: false, sortCol: 'attendanceDate' };
    this.attendanceService.getAttendances(query).subscribe((res) => {
      this.attendances = {
        ...res,
        list: res.list.map((item: any) => ({
          ...item,
          attendanceDate: this.functionService.formatDate(item.attendanceDate),
          hour: this.functionService.formatHour(item.attendanceDate)
        }))
      };
    });
  }

  openLocationPopup(employee: any) {
    this.selectedEmployee = employee;
    const modalElement = document.getElementById('locationModal') as HTMLDivElement;
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }
}
