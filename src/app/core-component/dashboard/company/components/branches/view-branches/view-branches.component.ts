import { Component, Input, OnInit } from '@angular/core';
import { BranchService } from '../../../../../../services/lockupsServices/branchService/branch.service';
import { branch } from '../../../../../../../models/branch';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { employee } from '../../../../../../../models/employee';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ModernTableComponent } from '../../../../components/modern-table/modern-table.component';
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { AssignEntityComponent } from '../assign-entity/assign-entity.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-view-branches',
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css'],
  providers: [BranchService, EmployeeService, MessageService,ConfirmationService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AddBranchComponent,
    AssignEntityComponent,
    ModernTableComponent,
    PaginationModule,
    TranslateModule,ConfirmDialogModule
  ],
})
export class ViewBranchesComponent implements OnInit {
  @Input() companyId?: number = 0;
  isAdd: boolean = false;
  isEdit: boolean = false;
  showOverView: boolean = false;
  branches: branch[] = [];
  branch!: branch;
  employees: employee[] = [];
  isAssignEntity: boolean = false;
  selectedBranch: branch | undefined = undefined;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isArabic: boolean =  localStorage.getItem('lang')=='ar'?true:false;;
  translatedColumns: string[] = [];
  constructor(private branchService: BranchService, private translate: TranslateService,
    private employeeService: EmployeeService, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }


  ngOnInit(): void {
    this.isArabic = this.translate.currentLang === 'ar';
    this.loadBranches();
    this.loadEmployees();
    this.companyId = Number(localStorage.getItem('companyId'));
    this.translate.onLangChange.subscribe((event) => {
      this.isArabic = event.lang === 'ar';
    });
  }

  loadBranches(page: number = this.currentPage): void {
    this.branchService.getBranch({ companyId: this.companyId, pageIndex: page, pageSize: this.itemsPerPage }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
        this.totalItems = response.data.totalRows;
      }
    });
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadBranches(this.currentPage);
  }

  loadEmployees(): void {
    if (this.companyId) {
      this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list.filter(
            (employee: any) => !employee.branchId
          );
        }
      });
    } else {
      this.showError('Company ID is missing');
    }
  }

  addBranch(): void {
    this.isAdd = true;
  }
  editBranch(branch: branch): void {
    this.isEdit = true;
    this.branch = branch
  }
  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.isEdit = isAdd;
    this.currentPage = 1;
    this.loadBranches(this.currentPage);
    this.loadEmployees();
  }
  showDetails(branchId: number): void {
    this.selectedBranch = this.branches.find(branch => branch.id === branchId);
    if (this.selectedBranch) {
      this.loadEmployeesForBranch(this.selectedBranch.id);
      this.showOverView = true;
    }
  }

  loadEmployeesForBranch(branchId: number): void {
    this.employeeService.loadEmployees({ branchId: branchId, companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list;
      }
    });
  }

  goBack(): void {
    this.showOverView = false;
    this.loadBranches(this.currentPage);
    this.loadEmployees();
  }
  assignEntity(branchId: number): void {
    this.selectedBranch = this.branches.find(branch => branch.id === branchId);
    this.isAssignEntity = true;
    this.loadUnassignedEmployees();
  }

  loadUnassignedEmployees(): void {
    if (this.companyId) {
      this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list.filter(
            (employee: any) => !employee.branchId
          );
        }
      });
    }
  }

  handleEntityAssigned(event: { employeeId: number, branchId: number }): void {
    const requestPayload = {
      employeeId: event.employeeId,
      branchId: event.branchId
    };
    this.employeeService.assginEmployeeToBranch(requestPayload).subscribe({
      next: (response) => {
        this.showSuccess('Employee assigned to branch successfully');
        this.isAssignEntity = false;
        this.loadBranches();
        this.loadEmployees();
      }
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }


  handleClose() {
    this.isAssignEntity = false;
  }
  toggleActivation(branch: branch): void {
    if (branch.isActive) {
      this.deactivateBranch(branch);
    } else {
      this.activateBranch(branch);
    }
  }

  activateBranch(branch: branch): void {
    this.branchService.activateBranch(branch.id, branch.companyId).subscribe({
      next: () => {
        branch.isActive = true;
        this.showSuccess('Branch activated successfully');
      }
    });
  }

  deactivateBranch(branch: branch): void {
    this.branchService.deactivateBranch(branch.id, branch.companyId).subscribe({
      next: () => {
        branch.isActive = false;
        this.showSuccess('Branch deactivated successfully');
      }
    });
  }
  translateColumns(): void {
    this.translatedColumns = [
      this.translate.instant('viewBranches.COLUMN_ID'),
      this.translate.instant('viewBranches.COLUMN_FULL_NAME'),
      this.translate.instant('viewBranches.COLUMN_POSITION_NAME'),
      this.translate.instant('viewBranches.COLUMN_DEPARTMENT_NAME')
    ];
  }
  deleteBranch(branchId: number): void {
    this.confirmationService.confirm({
      message: this.translate.instant('viewBranches.CONFIRM_DELETE_BRANCH'),
      header: this.translate.instant('viewBranches.DELETE_CONFIRMATION'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-primary',
      acceptLabel: this.translate.instant('viewBranches.YES'),
      rejectLabel: this.translate.instant('viewBranches.NO'),
      accept: () => {
        this.branchService.deleteBranch(branchId, this.companyId || 0)
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translate.instant('viewBranches.BRANCH_DELETED') });
              this.loadBranches();
              this.ngOnInit();
            }
          });
      }
    });
  }

}
