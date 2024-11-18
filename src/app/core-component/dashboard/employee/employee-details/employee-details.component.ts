import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { PersonalInformationComponent } from '../employeeDetailsComponents/personal-information/personal-information.component';
import { AdvancedInformationComponent } from '../employeeDetailsComponents/advanced-information/advanced-information.component';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { tap, catchError, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { employee } from '../../../../../models/employee';
import { accountStatus } from '../../../../../models/enums/accountStatus';
import { CountdownComponent } from '../../../../common-component/countdown/countdown.component';
import { AdminService } from '../../../../services/adminService/admin.service';
import { ToastersService } from '../../../../core/services/toast-service/toast.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FinancialComponent } from '../financial/financial.component';
import { ShiftsComponent } from '../shifts/shifts.component';
import { SalaryComponent } from '../salary/salary.component';
import { EmployeeRequestsComponent } from '../employee-requests/employee-requests.component';
import { LocalStorageService } from '../../../../services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  imports: [
    RouterLink,
    TranslateModule,
    MatTabsModule,
    CommonModule,
    PersonalInformationComponent,
    AdvancedInformationComponent,
    CountdownComponent,
    FinancialComponent,
    ShiftsComponent,
    SalaryComponent,
    EmployeeRequestsComponent,
  ],
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  activeTab: string = 'personal';
  id: number = 0;
  employee: employee = {} as employee;
  accountStatus = accountStatus;
  currentLang: string = 'en';
  isPending: string | null = '';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private toast: ToastersService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.id = Number(params.get('id'));
        this.getEmployee();
      });
    this.isPending = this.localStorageService.getItem('isPending');
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    console.log(this.isPending);
    
    console.log(accountStatus.Pending);
    console.log(this.employee.accountStatus);
    console.log(this.employee.accountStatus === accountStatus.Pending);
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  getEmployee() {
    this.employeeService
      .loadEmployees({ id: this.id })
      .pipe(
        tap((response: any) => {
          this.employee = response.data.list[0];
          console.log(response);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onImageError(event: any) {
    event.target.src = '../../../../assets/images/default.jpeg';
  }
  updateStatus(status: accountStatus): void {
    if (!this.id) return;
    this.adminService
      .EditStatus({ id: this.id, accountStatus: status })
      .subscribe({
        next: (response: any) => {
          this.toast.typeSuccess(`Employee ${status.toString()} successfully.`);
          this.getEmployee();
        },
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  handleRotatedImage(rotatedImageDataUrl: string) {
    if (rotatedImageDataUrl) {
      this.employee.referancePhoto = rotatedImageDataUrl;
    }
  }
}
