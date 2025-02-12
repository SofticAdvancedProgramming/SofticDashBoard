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
import { AdminStaticsService } from '../../../services/AdminStatistics/AdminStatics.service';
import { Router } from '@angular/router';
import { BasicLineChartComponent } from "../../../common-component/basic-line-chart/basic-line-chart.component";
import { BasicDonutChartComponent } from "../../../common-component/basic-donut-chart/basic-donut-chart.component";
import { ChartType } from 'ng-apexcharts';
import { FinancialLog, LeavesLog } from '../../../../models/employee';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe, GlobalFunctionsService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, DashboardCardComponent, BarChartComponent, DonutChartComponent, ModernTableComponent, CommonModule, TranslateModule, MapComponent, BasicLineChartComponent, BasicDonutChartComponent]
})

export class HomeIndexComponent {
  attendanceData: any = {};
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
  comapnyId: number = Number(localStorage.getItem('companyId')) || 0;
  public leavesLogData: LeavesLog = new LeavesLog();
  barChartOptions: any;
  donutChartOptions: any;
  barChartOptionsAr: any;
  donutChartOptionsAr: any;
  public newAction: any = [{
    isExisting: true,
    src: 'Location_.png'
  }];
  constructor(
    private translateService: TranslationService,
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private functionService: GlobalFunctionsService,
    private adminStatics: AdminStaticsService,
    private fb: FormBuilder,
    private router: Router
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
    this.getAdminStatistics();
      this.GetAttendanceDetails();
    this.fetchLeavesLog();
    this.fetchFinancialLog(); 
    this.loadDemoData();
  }

  public dashboardCards: any = [];
  public departmentEmploye: any[] = [];
  public assetCategory: any[] = [];
  public adminCounts!:
    {
      companyId: number,
      employeeCount: number,
      branchCount: number,
      assetCount: number,
      positionCount: number,
      departmentCount: number
    }
    public financialLogData: FinancialLog = {
      entitlements: 0,
      deductions: 0,
    };

 
 

  columns: any = ['employeeFirstName', 'attendanceType', 'attendanceDate', 'day', 'hour', 'department'];
  columnsAr: any = ['employeeFirstName', 'attendanceType', 'attendanceDate', 'dayAr', 'hour', 'department'];

  getAddress(e: any) {
    this.addressData = e;
  }

  map(event: any) {
    this.employee = event;
  }

  navigateToSecondPageWithTab(index: number) {
    this.router.navigate([`/dashboard/company/${this.comapnyId}`], { queryParams: { tab: index } });

  }

  getAttendances(searchDate = {}, pageIndex?: number) {
    let query: any = pageIndex ? { pageIndex, sortIsAsc: false, sortCol: "attendanceDate" } : { sortIsAsc: false, sortCol: "attendanceDate" };
    this.attendanceService.getAttendances({ ...searchDate, attendanceTypeId: null }).subscribe((res) => {
       console.log("hhhhhhhhhhhhhhhhhh",res);
      this.attendances = {
        ...res,
        list: res.data.list.map((item: any) => ({
          ...item,
          attendanceDate: this.functionService.formatDate(item.attendanceDate),
          hour: this.functionService.formatHour(item.attendanceDate),
          attendanceType: this.getAttendancebyTypeId(item.attendanceTypeId),
          department: item.employeeDepartmentName || 'no dept'

          // department: this.isArabic?item.employeeDepartmentNameAr: item.employeeDepartmentName|| this.isArabic?'لايوجد قسم':'no dept'
          // //this.getEmployeeDepartment(item['employeeId'],) || 'no dept'
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
    query = { ...query, employeeId: this.userId };

    this.employeeService.getStatistics(query).subscribe((res => {
      this.dashboardCards = res;
    }))
  }

  getAdminStatistics() {
    this.adminStatics.AdminCounts().subscribe((res => {

      this.adminCounts = res;
    }))
  }


  get isArabic(): boolean {
    return localStorage.getItem('lang') === 'ar';

  }


  GetAttendanceDetails() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const companyId = Number(localStorage.getItem('companyId')) || 0;

    const query = {
      companyId: companyId,
      month: currentMonth,
      year: currentYear,
    };

    this.attendanceService.GetAttendanceDetails(query).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.data) {
          this.attendanceData = {
            totalWorkedDays: res.data.totalWorkedDays,
            totalWorkedHours: res.data.totalWorkedHours.toFixed(2),
            totalAbsenceDays: res.data.totalAbsenceDays,
            totalOvertimeHours: res.data.totalOvertimeHours.toFixed(2),
          };
          console.log('Attendance Data:', this.attendanceData);
        } else {
          console.error('Failed to fetch attendance data:', res);
        }
      },
      (error) => {
        console.error('Error fetching attendance data:', error);
      }
    );
  }
  fetchLeavesLog() {
    const currentYear = new Date().getFullYear();

    const query = {
      companyId: this.comapnyId,
      year: currentYear,
    };

    this.employeeService.getLeavesLog(query).subscribe(
      (res: any) => {
        if (res && res.status === 200 && res.data) {
          this.leavesLogData = new LeavesLog(
            res.data.holidayRequest,
            res.data.vacationBalabnce
          );
        } else {
          console.error('Failed to fetch leaves log data:', res);
        }
      },
      (error) => {
        console.error('Error fetching leaves log data:', error);
      }
    );
  }
  fetchFinancialLog() {
    const currentYear = new Date().getFullYear(); 
  
    const request = {
       companyId: this.comapnyId, 
      year: currentYear, 
    };
  
    this.employeeService.getFinancialLog(request).subscribe(
      (res) => {
        if (res && res.status === 200 && res.data) {
          this.financialLogData = res.data;
          console.log('Financial Log Data:', this.financialLogData);
        } else {
          console.error('Failed to fetch financial log data:', res);
        }
      },
      (error) => {
        console.error('Error fetching financial log data:', error);
      }
    );
  }
  loadDemoData() {
    this.barChartOptions = {
      series: [
        {
          name: 'Assets Count',
          data: [30, 40, 45]  
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar']
      }
    };

    this.donutChartOptions = {
      series: [44, 55, 41, 17],  
      labels: ['Assigned', 'Unassigned', 'In Maintenance', 'Out of Service'],
      chart: {
        type: 'donut',
        height: 350
      }
    };

     this.barChartOptionsAr = {
      ...this.barChartOptions,
      xaxis: {
        categories: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو']
      }
    };

    this.donutChartOptionsAr = {
      ...this.donutChartOptions,
      labels: ['Assigned', 'Unassigned', 'In Maintenance', 'Out of Service'],
    };
  }
}


