import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { Department } from '../../../../../../models/department';
import { employee } from '../../../../../../models/employee';
import { EmployeeService } from '../../../../../services/employeeService/employee.service';
import { BranchService } from '../../../../../services/lockupsServices/branchService/branch.service';
import { DepartmentService } from '../../../../../services/lockupsServices/DepartmentService/department.service';
import { AssignEntityComponent } from '../../components/department/assign-entity/assign-entity.component';
import { DepartmentOverviewComponent } from '../../components/department/department-overview/department-overview.component';
import { DepartmentActionComponent } from "./department-action/department-action.component";

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DepartmentOverviewComponent,
    ToastModule,
    AssignEntityComponent,
    PaginationModule,
    TranslateModule, ConfirmDialogModule,
    DepartmentActionComponent
],
providers: [ConfirmationService],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {
  companyId?: number;
  @Output() departmentAdded = new EventEmitter<void>();
  selectedBranchId: any | null = null;
  showOverView: boolean = false;
  isAdd: boolean = false;
  isEdit: boolean = false;
  isAssignEntity: boolean = false;
  branches: any[] = [];
  departments: Department[] = [];
  department!: Department;
  employees: employee[] = [];
  filteredDepartments: Department[] = [];
  selectedDepartment: Department | null = null;
  selectedEntityId: string | undefined = undefined;
  entityType: string = 'Employee';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isArabic: boolean =  localStorage.getItem('lang')=='ar'?true:false;;


  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private branchService: BranchService
  ) { }
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe(params => {
      this.companyId = +params['companyId'];

      this.loadBranches();
      this.loadDepartments();

    });
    this.isArabic = this.translate.currentLang === 'ar';
    this.subscription.add(this.translate.onLangChange.subscribe(() => {
      this.checkLanguage();
    }));
  }
  checkLanguage(): void {
    this.isArabic = this.translate.currentLang === 'ar';
  }
  loadDepartments(page: number = this.currentPage): void {
    const companyId = this.getCompanyId();
    if (!companyId) return;

    const payload: any = {
      companyId,
      pageIndex: page,
      pageSize: this.itemsPerPage,
    };

    if (this.selectedBranchId !== null) {
      if(this.selectedBranchId==='centralized'){
        payload.isCentralized=true;
      }else{
        payload.branchId = this.selectedBranchId;
      }

    }




    this.departmentService.getDepartment(payload).subscribe({
      next: (response) => {

        this.departments = response.data.list;
        this.filteredDepartments = [...this.departments];
        this.totalItems = response.data.totalRows;
      },

    });
  }

  filterDepartmentsByBranch(): void {
    this.currentPage = 1;
    this.loadDepartments();
  }


  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadDepartments(this.currentPage);
  }

  loadEmployees(): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.employeeService.loadEmployees({ companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list.filter((employee: employee) => !employee.departmentId);
        }
      });
    }
  }

  addDepartment(): void {
    this.isAdd = true;
  }

  assignEntity(departmentId: string): void {
    this.selectedEntityId = departmentId;
    this.isAssignEntity = true;
    this.selectedDepartment = this.departments.find(dep => dep.id === Number(departmentId)) || null;
  }

  handleEntityAssigned(event: { entityId: number; relatedEntityId: number }): void {
    const requestPayload = {
      employeeId: event.entityId,
      departmentId: event.relatedEntityId
    };
    this.employeeService.assginEmployeeToDepartment(requestPayload).subscribe({
      next: () => {
        this.showSuccess(this.isArabic?'تمت إضافة الموظف للقسم بنجاح':'Employee assigned to department successfully');
        this.isAssignEntity = false;
        this.loadDepartments();
      }
    });
  }

  showDetails(departmentId: number): void {
    this.selectedDepartment = this.departments.find(dep => dep.id === departmentId) || null;
    this.showOverView = !!this.selectedDepartment;
  }

  goBack(): void {
    this.showOverView = this.isAdd = this.isAssignEntity = false;
  }

  handleAction(action: boolean): void {
    if (action === false) {
      this.isAdd = false;
      this.isEdit = false;
      this.loadDepartments();
    }
  }


  toggleActivation(department: Department): void {
    department.isActive ? this.deactivateDepartment(department) : this.activateDepartment(department);
  }

  activateDepartment(department: Department): void {
    const companyId = this.getCompanyId();
    this.departmentService.activateDepartment(department.id, companyId || 0).subscribe({
      next: () => {
        department.isActive = true;
        this.showSuccess(this.isArabic?'تم تنشيط القسم بنجاح':'Department activated successfully');
      }
    });
  }

  deactivateDepartment(department: Department): void {
    const companyId = this.getCompanyId();
    this.departmentService.deactivateDepartment(department.id, companyId || 0).subscribe({
      next: () => {
        department.isActive = false;
        this.showSuccess(this.isArabic?'تم إيقاف القسم بنجاح':'Department deactivated successfully');
      }
    });
  }

  private getCompanyId(): number | null {
    const storedCompanyId = localStorage.getItem('companyId');
    return storedCompanyId ? Number(storedCompanyId) : null;
  }

  editDepartment(department: Department) {
    this.isEdit = true;
    this.department = department;

  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }
  deleteDepartment(departmentId: number): void {
    this.confirmationService.confirm({
      message: this.translate.instant('DEPARTMENTS.CONFIRM_DELETE_MESSAGE'),
      header: this.translate.instant('DEPARTMENTS.DELETE_CONFIRMATION_TITLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('DEPARTMENTS.YES'),
      rejectLabel: this.translate.instant('DEPARTMENTS.NO'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        const companyId = this.getCompanyId();
        if (companyId) {
          this.departmentService.deleteDepartment(departmentId, companyId).subscribe({
            next: () => {
              this.showSuccess(this.translate.instant('DEPARTMENTS.DELETE_SUCCESS'));
              this.loadDepartments();
              this.ngOnInit();
            }
          });
        }
      },
      reject: () => {
      }
    });
  }
  isCentralized:boolean=false;
  loadBranches(): void {
    this.branchService.getBranch().subscribe({
      next: (response) => {
        this.branches = [{ id: null, name: 'All Branches', nameAr: 'كل الفروع' }, ...response.data.list,{ id: 'centralized', name: 'Centralized', nameAr: 'الأقسام المركزية' }];

        this.selectedBranchId = null;
        this.filterDepartmentsByBranch();
      },

    });
  }
}

