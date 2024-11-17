import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardCardComponent } from '../components/dashboard-card/dashboard-card.component';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { DonutChartComponent } from '../components/donut-chart/donut-chart.component';
import { ModernTableComponent } from '../components/modern-table/modern-table.component';
import { Browser } from '../../../../assets/ej2-base';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslationService } from '../../../core/services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';
 import { MapComponent } from "../../../common-component/map/map.component";
 import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AttendanceService } from '../../../services/AttendanceService/attendance.service';
 import { EmployeeService } from '../../../services/employeeService/employee.service';
import { GlobalFunctionsService } from '../../../services/Global Functions Dashboard/global-functions.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, DashboardCardComponent, BarChartComponent, DonutChartComponent, ModernTableComponent, CommonModule, TranslateModule, MapComponent],
  providers: [provideNativeDateAdapter(),DatePipe, GlobalFunctionsService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeIndexComponent {
  public employee: any;
  attendances: any = [];
  public addressData: any;
  userId = Number(localStorage.getItem('userId')) || 0;
  public lang = localStorage.getItem('lang') || 'ar'
  public user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : {};
  public roles = JSON.parse(localStorage.getItem('roles')!);
  startDate!: Date;
  endDate!: Date;
  form!: FormGroup;
  cards: any = [];

  public newAction: any = [{
    isExisting: true,
    src: 'map.png'
  }];
  constructor(
    private translateService: TranslationService,
    private attendanceService: AttendanceService,
     private employeeService: EmployeeService,
     private functionService: GlobalFunctionsService,

    private fb: FormBuilder,
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.startDate = new Date(currentYear, currentMonth, 1);
    this.endDate = new Date(currentYear, currentMonth + 1, 0);
    this.form = this.fb.group({
      from: [this.startDate],
      to: [this.endDate]
    });
    this.getStatistics();
    this.getAttendances({}, 1);
  }

  public dashboardCards: any = [];

  public chartData: Object[] = [
    { Country: this.translateService.translate("Request an advance"), Literacy_Rate: 19.1 },
    { Country: this.translateService.translate("Delay requests"), Literacy_Rate: 48.1 },
    { Country: this.translateService.translate("Vacation requests"), Literacy_Rate: 26.8 },
  ];

  public data: Object[] = [
    { x: 'Chrome', y: 61.3, DataLabelMappingName: Browser.isDevice ? 'Chrome: <br> 61.3%' : 'Chrome: 61.3%' },
    { x: 'Safari', y: 24.6, DataLabelMappingName: Browser.isDevice ? 'Safari: <br> 24.6%' : 'Safari: 24.6%' },
    { x: 'Edge', y: 5.0, DataLabelMappingName: 'Edge: 5.0%' },
    { x: 'Samsung Internet', y: 2.7, DataLabelMappingName: Browser.isDevice ? 'Samsung Internet: <br> 2.7%' : 'Samsung Internet: 2.7%' },
    { x: 'Firefox', y: 2.6, DataLabelMappingName: Browser.isDevice ? 'Firefox: <br> 2.6%' : 'Firefox: 2.6%' },
    { x: 'Others', y: 3.6, DataLabelMappingName: Browser.isDevice ? 'Others: <br> 3.6%' : 'Others: 3.6%' }
  ];

  public donutChartData = {
    labels: ['Riyadh', 'Jeddah', 'Dammam', 'Other'],
    datasets: [
      {
        data: [20.8, 10.2, 19, 50],
        backgroundColor: ['#FF9800', '#4CAF50', '#2196F3', '#9E9E9E'],
        hoverBackgroundColor: ['#FFB74D', '#81C784', '#64B5F6', '#BDBDBD']
      }
    ]
  };

  public donutChartOptions = {
    cutout: '60%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  columns: any = ['employeeFirstName', 'attendanceType', 'attendanceDate', 'day', 'hour'];

  getAddress(e: any) {
    this.addressData = e;
  }

  map(event: any) {
    this.employee = event;
  }

  getAttendances(searchDate = {}, pageIndex?: number) {
    let query: any = pageIndex ? { pageIndex, sortIsAsc: false, sortCol: "attendanceDate" } : { sortIsAsc: false, sortCol: "attendanceDate"};
    if (this.roles[0] === 'Employee') {
      query = { ...query, employeeId: this.userId };
    }
    this.attendanceService.getAttendances({ ...searchDate, ...query, attendanceTypeId: null }).subscribe((res) => {
      this.attendances = {
        ...res,
        list: res.list.map((item: any) => ({
          ...item,
          attendanceDate: this.functionService.formatDate(item.attendanceDate),
          hour: this.functionService.formatHour(item.attendanceDate),
          attendanceType: this.getAttendancebyTypeId(item.attendanceTypeId)
        })),
      };
    });
  }

  getAttendancebyTypeId(type: number): string {
    if (type === 1) return this.translateService.translate('Attendance');
    if (type === 2) return this.translateService.translate('Departure');
    if (type === 3) return this.translateService.translate('Absence');
    return '';
  }

  searchDateApi(event: any) {
    const { fromDate, toDate } = event;
    this.getAttendances({ attendanceDateFrom: fromDate, attendanceDateTo: toDate });
  }


  getStatistics() {
    let query: any = { ...this.form.value };
    if (this.roles[0] === 'Employee') {
      query = { ...query, employeeId: this.userId };
    }
    this.employeeService.getStatistics(query).subscribe((res => {
      this.dashboardCards = res;
    }))
  }

}

