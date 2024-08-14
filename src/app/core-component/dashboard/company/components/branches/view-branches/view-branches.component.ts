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

@Component({
  selector: 'app-view-branches',
  standalone: true,
  templateUrl: './view-branches.component.html',
  styleUrls: ['./view-branches.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AddBranchComponent,
    AssignEntityComponent,
    ModernTableComponent
  ],
  providers: [BranchService, EmployeeService, MessageService]
})
export class ViewBranchesComponent implements OnInit {
  @Input() companyId?: number = 0 ;
  isAdd: boolean = false;
  showOverView: boolean = false; // Added flag to control view
  branches: branch[] = [];
  employees: employee[] = [];
  isAssignEntity: boolean = false;
  selectedBranch: branch | undefined = undefined;

  constructor(private branchService: BranchService, private employeeService: EmployeeService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadBranches();
    this.loadEmployees();
    this.companyId = Number(localStorage.getItem('companyId'));
  }

  loadBranches(): void {
    this.branchService.getBranch({ comapnyId:this.companyId }).subscribe({
      next: (response) => {
        this.branches = response.data.list;
        console.log("Branches loaded:", this.branches);
      },
      error: (err) => {
        console.error('Error loading branches', err);
        this.showError('Error loading branches');
      }
    });
  }

  loadEmployees(): void {
    if (this.companyId) {
      this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list.filter(
            (employee: any) => !employee.branchId
          );
          console.log("Filtered Employees:", this.employees);
        },
        error: (err) => {
          console.error('Error loading employees', err);
          this.showError('Error loading employees');
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
      },
      error: (err) => {
        console.error('Error loading employees', err);
        this.showError('Error loading employees');
      }
    });
  }


  goBack(): void {
    this.showOverView = false;
  }

  assignEntity(branchId: number): void {
    this.selectedBranch = this.branches.find(branch => branch.id === branchId);
    this.isAssignEntity = true;
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
      },
      error: (err) => {
        console.error('Error assigning employee to branch', err);
        this.showError('Error assigning employee to branch');
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
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting branch' });
        }
      });
  }
}
