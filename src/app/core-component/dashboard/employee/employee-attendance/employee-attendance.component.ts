import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  imports: [CommonModule, MapComponent, ModernTableComponent, TranslateModule],
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
  public attendanceTypeId: number = 1;
  public attendanceType: string = '';
  public newAction: any[] = [
    {
      isExisting: true,
      src: 'Location_.png',
    },
  ];
  public id: number | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.getAttendances();
    } else {
      console.error('No employeeId found in route parameters.');
    }
    this.setAttendanceType();
  }

  getAttendances(pageIndex?: number) {
    const query = {
      employeeId: this.id,
      attendanceTypeId: this.attendanceTypeId,
      pageIndex: pageIndex || 1,
      pageSize: 10,
      sortIsAsc: false,
      sortCol: 'attendanceDate',
    };

    this.attendanceService.getAttendances(query).subscribe((res: any) => {
      console.log("attendance",res)
      this.attendances = {
        ...res,
        list: res.list.map((item: any) => ({
          ...item,
          attendanceDate: this.datePipe.transform(
            item.attendanceDate,
            'yyyy-MM-dd'
          ),
          hour:this.datePipe.transform((item.attendanceDate), 'HH:mm:ss'),
          latitude: item.lat || 0,
          longitude: item.long || 0,
        })),
      };

     
    });
  }

  changeAttendanceTypeId(type: number) {
    this.attendanceTypeId = type;
    this.setAttendanceType();
    this.getAttendances();
  }

  setAttendanceType() {
    this.attendanceType = this.translateService.instant(
      this.attendanceTypeId === 1
        ? 'ATTENDANCE'
        : this.attendanceTypeId === 2
        ? 'DEPARTURE'
        : 'ABSENCE'
    );
  }

  openLocationPopup(employee: any) {
    this.selectedEmployee = employee;

    this.employee = {
      ...employee,
      lat: employee.latitude || 0,
      long: employee.longitude || 0,
    };

    

    this.showModal = true;
  }

  closeLocationPopup() {
    this.showModal = false;
    this.selectedEmployee = null;
  }
}
