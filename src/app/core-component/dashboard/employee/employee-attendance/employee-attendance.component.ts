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
  public employeeLocations: any[] = []; // Store attendance locations for map
  public showModal: boolean = false;
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
      this.getAttendances(this.id);
    } else {
      console.error('No employeeId found in route parameters.');
    }
  }

  getAttendances(employeeId: number, pageIndex?: number) {
    const query = {
      employeeId,  
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
    });
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

    console.log('Employee Locations:', this.employeeLocations);

    this.showModal = true;
  }

  closeLocationPopup() {
    this.showModal = false;
    this.selectedEmployee = null;
  }
}
