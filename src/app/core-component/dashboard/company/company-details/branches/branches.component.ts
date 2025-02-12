import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { branch } from '../../../../../../models/branch';
import { employee } from '../../../../../../models/employee';
import { EmployeeService } from '../../../../../services/employeeService/employee.service';
import { BranchService } from '../../../../../services/lockupsServices/branchService/branch.service';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { BranchesActionComponent } from "./branches-action/branches-action.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    PaginationModule,
    TranslateModule, ConfirmDialogModule,
    BranchesActionComponent
],
  providers: [ConfirmationService],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent implements OnInit {
  // @Input() companyId?: number = 0;
  companyId?: number = 0;
  isAdd: boolean = false;
  isEdit: boolean = false;
  branches: branch[] = [];
  branch!: branch;
  isAssignEntity: boolean = false;
  selectedBranch: branch | undefined = undefined;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isArabic: boolean =  localStorage.getItem('lang')=='ar'?true:false;;
  translatedColumns: string[] = [];
  constructor(
    private branchService: BranchService,
    private translate: TranslateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit(): void {

    this.isArabic = this.translate.currentLang === 'ar';
    this.activatedRoute.parent?.params.subscribe(params => {
      this.companyId = +params['companyId'];
      this.loadBranches();
    });
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
  }




  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
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

