import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../../../services/AttendanceService/attendance.service';
import { PaginatedAttendances } from '../../../../../models/attendances';
import { CommonModule, DatePipe } from '@angular/common';
import { MapComponent } from "../../../../common-component/map/map.component";
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css'],
  providers: [DatePipe],
  imports: [CommonModule, MapComponent, ModernTableComponent]
})
export class EmployeeAttendanceComponent implements OnInit {
  public employee: any = null;

  public attendances: PaginatedAttendances = {
    pageIndex: 1,
    pageSize: 10,
    totalRows: 0,
    totalPages: 0,
    list: [],
  };
  public selectedEmployee: any = null;
  public employeeLocations: any[] = []; 
  public showModal: boolean = false;
  public newAction: any[] = [
    {
      isExisting: true,  
      src: 'location.png',  
    },
  ];
  constructor(
    private attendanceService: AttendanceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAttendances();
  }

  getAttendances(pageIndex?: number) {
    const query = {
      pageIndex: pageIndex || 1,
      sortIsAsc: false,
      sortCol: 'attendanceDate',
    };

    this.attendanceService.getAttendances(query).subscribe((res) => {
      this.attendances = {
        ...res,
        list: res.list.map((item: any) => ({
          ...item,
          latitude: item.latitude || 0, // Ensure latitude exists
          longitude: item.longitude || 0, // Ensure longitude exists
        })),
      };
    });
  }

  map(event: any) {
    this.employee = {
      ...event,
      lat: event.latitude || 0, // Use latitude from API
      long: event.longitude || 0, // Use longitude from API
    };

    console.log('Selected Employee:', this.employee);
  }

  openLocationPopup(employee: any) {
    this.selectedEmployee = employee;

    this.employeeLocations = this.attendances.list
      .filter((record: any) => record.employeeId === employee.employeeId)
      .map((record: any) => ({
        date: record.attendanceDate,
        lat: record.latitude,
        long: record.longitude,
      }));

    console.log(this.employeeLocations);

    this.showModal = true;
  }

  closeLocationPopup() {
    this.showModal = false;
  }
}
