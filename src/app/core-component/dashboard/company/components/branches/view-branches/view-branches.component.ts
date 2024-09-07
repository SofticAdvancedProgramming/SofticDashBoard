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
@Component({
  selector: 'app-view-branches',
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css'],
  providers: [BranchService, EmployeeService, MessageService],
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AddBranchComponent,
    AssignEntityComponent,
    ModernTableComponent,
    PaginationModule
  ],
})
export class ViewBranchesComponent implements OnInit {
  @Input() companyId?: number = 0 ;
  isAdd: boolean = false;
  showOverView: boolean = false;
  branches: branch[] = [];
  employees: employee[] = [];
  isAssignEntity: boolean = false;
  selectedBranch: branch | undefined = undefined;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  constructor(private branchService: BranchService, private employeeService: EmployeeService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadBranches();
    this.loadEmployees();
    this.companyId = Number(localStorage.getItem('companyId'));
  }

  loadBranches(page: number = this.currentPage): void {
    this.branchService.getBranch({ companyId: this.companyId, pageIndex: page, pageSize: this.itemsPerPage }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
        this.totalItems = response.data.totalRows;
        console.log("Branches loaded:", this.branches);
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
          console.log("Filtered Employees:", this.employees);
        }
      });
    } else {
      this.showError('Company ID is missing');
    }
  }

  addBranch(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.loadBranches();
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
    this.employeeService.loadEmployees({ branchId: branchId, companyId: this.companyId  }).subscribe({
      next: (response) => {
        this.employees = response.data.list;
        console.log("Employees loaded for branch:", this.employees);
      }
    });
  }

  goBack(): void {
    this.showOverView = false;
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

  deleteBranch(branchId: number): void {
    this.branchService.deleteBranch(branchId, this.companyId||0)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Branch deleted successfully' });
          this.loadBranches();
        }
      });
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
    this.branchService.ActivateBranch(branch.id,branch.companyId).subscribe({
      next: () => {
        branch.isActive = true;
        this.showSuccess('Branch activated successfully');
      }
    });
  }

  deactivateBranch(branch: branch): void {
    this.branchService.DeActivateBranch(branch.id,branch.companyId).subscribe({
      next: () => {
        branch.isActive = false;
        this.showSuccess('Branch deactivated successfully');
      }
    });
  }

}
