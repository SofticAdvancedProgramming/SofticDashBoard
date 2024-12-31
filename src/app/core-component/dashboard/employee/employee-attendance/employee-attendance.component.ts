import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../../../services/AttendanceService/attendance.service';
import { PaginatedAttendances } from '../../../../../models/attendances';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MapComponent } from '../../../../common-component/map/map.component';
import { ModernTableComponent } from '../../components/modern-table/modern-table.component';

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css'],
  providers: [DatePipe],
  imports: [CommonModule, MapComponent, ModernTableComponent],
})
export class EmployeeAttendanceComponent implements OnInit {
  public attendances: PaginatedAttendances = {
    pageIndex: 1,
    pageSize: 10,
    totalRows: 0,
    totalPages: 0,
    list: [],
  };

  public selectedEmployee: any = null;
  public employee: any;
  public showModal: boolean = false;
  public attendanceTypeId: number = 1; // Default to Attendance
  public attendanceType: string = 'Attendance'; // To display the current type
  public newAction: any[] = [
    {
      isExisting: true,
      src: 'location.png',
    },
  ];
  public id: number | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.getAttendances();
    } else {
      console.error('No employeeId found in route parameters.');
    }
  }

  getAttendances(pageIndex?: number) {
    const query = {
      employeeId: this.id, // Include employeeId from the route
      attendanceTypeId: this.attendanceTypeId, // Filter by the selected type
      pageIndex: pageIndex || 1,
      pageSize: 10,
      sortIsAsc: false,
      sortCol: 'attendanceDate',
    };

    this.attendanceService.getAttendances(query).subscribe((res: any) => {
      this.attendances = {
        ...res,
        list: res.list.map((item: any) => ({
          ...item,
          attendanceDate: this.datePipe.transform(
            item.attendanceDate,
            'yyyy-MM-dd HH:mm:ss'
          ),
          latitude: item.lat || 0,
          longitude: item.long || 0,
        })),
      };

      console.log('Attendance Data:', this.attendances.list);
    });
  }

  changeAttendanceTypeId(type: number) {
    this.attendanceTypeId = type;
    this.attendanceType =
      type === 1 ? 'Attendance' : type === 2 ? 'Departure' : 'Absence';
    this.getAttendances();
  }

  openLocationPopup(employee: any) {
    this.selectedEmployee = employee;

    this.employee = {
      ...employee,
      lat: employee.latitude || 0,
      long: employee.longitude || 0,
    };

    console.log('Selected Employee:', this.employee, 'Type:', this.attendanceType);

    this.showModal = true;
  }

  closeLocationPopup() {
    this.showModal = false;
    this.selectedEmployee = null;
  }
}
