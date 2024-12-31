import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { PersonalInformationComponent } from '../employeeDetailsComponents/personal-information/personal-information.component';
import { AdvancedInformationComponent } from '../employeeDetailsComponents/advanced-information/advanced-information.component';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { tap, catchError, of, Subject, firstValueFrom } from 'rxjs';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeAssetsComponent } from '../employee-assets/employee-assets/employee-assets.component';
import { EmployeeAttendanceComponent } from "../employee-attendance/employee-attendance.component";
declare var bootstrap: any;

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
        FormsModule, ReactiveFormsModule,
        EmployeeAssetsComponent,
        EmployeeAttendanceComponent
    ]
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  activeTab: string = 'personal';
  id: number = 0;
  employee: employee = {} as employee;
  accountStatus = accountStatus;
  currentLang: string = 'en';
  isPending: string | null = '';
  form!:FormGroup;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private adminService: AdminService,
    private toast: ToastersService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.form = this.fb.group({
      rejectionReson:['', Validators.required]
   });
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (params) => {
        this.id = Number(params.get('id'));
  
        await this.getEmployee(); // Wait for employee data to load
  
        // Now it's safe to access this.employee
        console.log("this.employee.accountStatus:", this.employee.accountStatus);
        console.log(
          "Is account status pending?",
          this.employee.accountStatus === accountStatus.Pending
        );
      });
  
    this.isPending = this.localStorageService.getItem('isPending');
    this.currentLang = this.translate.currentLang;
  
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    console.log("employee.accountStatus==accountStatus.Active",this.employee.accountStatus==accountStatus.Active)
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  async getEmployee(): Promise<void> {
    const response: any = await firstValueFrom(
      this.employeeService.loadEmployees({ id: this.id })
    );
    this.employee = response.data.list[0];
    console.log("Employee data loaded:", this.employee);
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
          this.toast.typeSuccess(`${response.message}`);
          this.getEmployee();
        },
      });
  }
  updateStatusToReject(status: accountStatus): void {
    if (!this.id) return;
    this.addRejectReason();
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

  addRejectReason(){
    const modalElement = document.getElementById('rejectionPopUpModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  reject(status: accountStatus){
    const rejectionReson=this.form.value.rejectionReson;
    console.log(rejectionReson);
    this.adminService
      .EditStatus({ id: this.id, accountStatus: status ,comment:rejectionReson})
      .subscribe({
        next: (response: any) => {
          this.toast.typeSuccess(`${response.message}`);
          this.getEmployee();
        },
      });
  }
  onCancel(){

  }
}
